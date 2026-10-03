import { NextResponse } from "next/server";

/*
|--------------------------------------------------------------------------
| Gemini API
|--------------------------------------------------------------------------
*/

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/interactions";

/*
|--------------------------------------------------------------------------
| Current Gemini models
|--------------------------------------------------------------------------
|
| 2.5 models intentionally removed.
| 3.8 is the primary model.
|
*/

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];

/*
|--------------------------------------------------------------------------
| File limits
|--------------------------------------------------------------------------
*/

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

/*
|--------------------------------------------------------------------------
| Gemini structured response schema
|--------------------------------------------------------------------------
*/

const responseSchema = {
  type: "object",

  properties: {
    patient: {
      type: "object",

      properties: {
        name: {
          type: "string",
        },

        age: {
          type: "string",
        },

        gender: {
          type: "string",
        },
      },

      required: [
        "name",
        "age",
        "gender",
      ],
    },

    report: {
      type: "object",

      properties: {
        name: {
          type: "string",
        },

        date: {
          type: "string",
        },
      },

      required: [
        "name",
        "date",
      ],
    },

    results: {
      type: "array",

      items: {
        type: "object",

        properties: {
          parameter: {
            type: "string",
          },

          value: {
            type: "string",
          },

          unit: {
            type: "string",
          },

          referenceRange: {
            type: "string",
          },

          status: {
            type: "string",

            enum: [
              "NORMAL",
              "HIGH",
              "LOW",
              "UNKNOWN",
            ],
          },

          explanation: {
            type: "string",
          },
        },

        required: [
          "parameter",
          "value",
          "unit",
          "referenceRange",
          "status",
          "explanation",
        ],
      },
    },

    summary: {
      type: "string",
    },

    doctorReview: {
      type: "string",
    },
  },

  required: [
    "patient",
    "report",
    "results",
    "summary",
    "doctorReview",
  ],
};

/*
|--------------------------------------------------------------------------
| Extract Gemini text
|--------------------------------------------------------------------------
*/

function extractGeminiText(data: any): string {
  if (
    typeof data?.output_text === "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  if (Array.isArray(data?.steps)) {
    const parts: string[] = [];

    for (const step of data.steps) {
      if (
        step?.type !== "model_output"
      ) {
        continue;
      }

      if (
        !Array.isArray(
          step?.content
        )
      ) {
        continue;
      }

      for (
        const content of step.content
      ) {
        if (
          content?.type === "text" &&
          typeof content?.text === "string"
        ) {
          parts.push(
            content.text
          );
        }
      }
    }

    if (parts.length > 0) {
      return parts
        .join("\n")
        .trim();
    }
  }

  if (
    Array.isArray(
      data?.outputs
    )
  ) {
    for (
      const output of data.outputs
    ) {
      if (
        typeof output?.text === "string" &&
        output.text.trim()
      ) {
        return output.text.trim();
      }

      if (
        Array.isArray(
          output?.content
        )
      ) {
        for (
          const content of
            output.content
        ) {
          if (
            typeof content?.text ===
              "string" &&
            content.text.trim()
          ) {
            return content.text.trim();
          }
        }
      }
    }
  }

  if (
    typeof data?.output?.text ===
      "string" &&
    data.output.text.trim()
  ) {
    return data.output.text.trim();
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| Clean JSON
|--------------------------------------------------------------------------
*/

function cleanJsonText(
  text: string
): string {
  let result =
    text.trim();

  if (
    result.startsWith(
      "```json"
    )
  ) {
    result =
      result.replace(
        /^```json\s*/i,
        ""
      );

    result =
      result.replace(
        /\s*```$/i,
        ""
      );
  }

  if (
    result.startsWith(
      "```"
    )
  ) {
    result =
      result.replace(
        /^```\s*/i,
        ""
      );

    result =
      result.replace(
        /\s*```$/i,
        ""
      );
  }

  return result.trim();
}

/*
|--------------------------------------------------------------------------
| Temporary Gemini error detector
|--------------------------------------------------------------------------
*/

function isTemporaryError(
  status: number,
  message: string
): boolean {
  if (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return true;
  }

  const error =
    message.toLowerCase();

  const temporaryWords = [
    "high demand",
    "try again later",
    "temporarily unavailable",
    "overloaded",
    "resource exhausted",
    "rate limit",
    "quota",
    "capacity",
  ];

  return temporaryWords.some(
    (word) =>
      error.includes(word)
  );
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
*/

export async function POST(
  request: Request
) {
  try {
    /*
     * API key
     */

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,

          error:
            "GEMINI_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Form data
     */

    const formData =
      await request.formData();

    const file =
      formData.get(
        "file"
      );

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Please upload a medical report file.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * File type
     */

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Unsupported file type. Please upload PDF, JPG, PNG or WEBP.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * File size
     */

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "File size must be 5 MB or less.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "===================================="
    );

    console.log(
      "HOMEHEALTH 360 - MEDICAL AI"
    );

    console.log(
      "File:",
      file.name
    );

    console.log(
      "Type:",
      file.type
    );

    console.log(
      "Size:",
      file.size
    );

    /*
     * Convert uploaded file
     * to Base64
     */

    const arrayBuffer =
      await file.arrayBuffer();

    const base64 =
      Buffer.from(
        arrayBuffer
      ).toString(
        "base64"
      );

    /*
     * Medical analysis prompt
     */

    const prompt = `
You are the Medical Report Analysis AI
for HOMEHEALTH 360.

Analyze the uploaded medical report.

Only use information that is actually visible
and readable in the uploaded file.

NEVER GUESS.

If information is missing or unreadable,
write "Not provided".

PATIENT:

Extract:
- name
- age
- gender

REPORT:

Extract:
- report/test name
- report date

RESULTS:

Extract every clearly readable medical parameter.

For every parameter return:

parameter
value
unit
referenceRange
status
explanation

STATUS:

NORMAL:
Value is inside the reference range printed
on the report.

HIGH:
Value is above the reference range printed
on the report.

LOW:
Value is below the reference range printed
on the report.

UNKNOWN:
Cannot reliably determine.

IMPORTANT:

Use the reference range printed on the
uploaded report.

Do not replace it with a generic reference
range.

Do not invent values.

Do not change numerical values.

Do not change units.

Do not diagnose.

Do not prescribe medicine.

Do not provide dosage.

Do not claim that the patient definitely
has a disease.

Explain medical values in simple language.

If an abnormal result appears important,
recommend discussing it with a qualified
healthcare professional.

The final medical decision must always
remain with a qualified doctor.

SUMMARY:

Give a simple explanation of the overall
report.

DOCTOR REVIEW:

Give a short note about what a qualified
doctor may want to review.

Do not provide diagnosis,
prescription or dosage.

Return ONLY valid JSON.

Do not return Markdown.

Do not return code fences.

Follow the JSON schema exactly.
`;

    /*
     * PDF or image
     */

    let uploadedContent: any;

    if (
      file.type ===
      "application/pdf"
    ) {
      uploadedContent = {
        type: "document",

        data: base64,

        mime_type:
          "application/pdf",
      };
    } else {
      uploadedContent = {
        type: "image",

        data: base64,

        mime_type:
          file.type,
      };
    }

    /*
     * Keep all model errors
     */

    const errors: Array<{
      model: string;
      status: number;
      error: string;
    }> = [];

    /*
     * Try models one by one
     */

    for (
      let i = 0;
      i < MODELS.length;
      i++
    ) {
      const model =
        MODELS[i];

      console.log(
        `Trying model ${i + 1}/${MODELS.length}: ${model}`
      );

      const payload = {
        model,

        input: [
          {
            type: "text",

            text: prompt,
          },

          uploadedContent,
        ],

        response_format: {
          type: "text",

          mime_type:
            "application/json",

          schema:
            responseSchema,
        },
      };

      try {
        /*
         * Gemini request
         */

        const response =
          await fetch(
            GEMINI_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                "x-goog-api-key":
                  apiKey,
              },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        const data =
          await response.json();

        /*
         * API error
         */

        if (
          !response.ok
        ) {
          const message =
            data?.error?.message ||
            `Gemini HTTP ${response.status}`;

          console.error(
            `Model ${model} failed:`,
            message
          );

          errors.push({
            model,

            status:
              response.status,

            error:
              message,
          });

          /*
           * Temporary error:
           * move to next model
           */

          if (
            isTemporaryError(
              response.status,
              message
            )
          ) {
            console.log(
              `Moving to next model...`
            );

            continue;
          }

          /*
           * Permanent error
           */

          return NextResponse.json(
            {
              success: false,

              error:
                message,

              model,

              details:
                data?.error ||
                null,
            },
            {
              status:
                response.status,
            }
          );
        }

        /*
         * Extract response
         */

        const output =
          extractGeminiText(
            data
          );

        if (!output) {
          errors.push({
            model,

            status: 502,

            error:
              "Gemini returned empty output.",
          });

          console.log(
            `Empty output from ${model}. Trying next model...`
          );

          continue;
        }

        /*
         * Parse JSON
         */

        const cleaned =
          cleanJsonText(
            output
          );

        let analysis: any;

        try {
          analysis =
            JSON.parse(
              cleaned
            );
        } catch {
          console.error(
            `Invalid JSON from ${model}:`,
            output
          );

          errors.push({
            model,

            status: 502,

            error:
              "Gemini returned invalid JSON.",
          });

          continue;
        }

        /*
         * Validate response
         */

        if (
          !analysis ||
          typeof analysis !==
            "object" ||
          !analysis.patient ||
          !analysis.report ||
          !Array.isArray(
            analysis.results
          )
        ) {
          errors.push({
            model,

            status: 502,

            error:
              "Incomplete medical report analysis.",
          });

          continue;
        }

        /*
         * Defaults
         */

        if (
          typeof analysis.summary !==
          "string"
        ) {
          analysis.summary =
            "Not provided";
        }

        if (
          typeof analysis.doctorReview !==
          "string"
        ) {
          analysis.doctorReview =
            "Please review this report with a qualified healthcare professional.";
        }

        /*
         * SUCCESS
         */

        console.log(
          "===================================="
        );

        console.log(
          "MEDICAL AI SUCCESS"
        );

        console.log(
          "MODEL:",
          model
        );

        console.log(
          "INTERACTION:",
          data?.id || "N/A"
        );

        console.log(
          "===================================="
        );

        return NextResponse.json(
          {
            success: true,

            model,

            fileName:
              file.name,

            fileType:
              file.type,

            analysis,

            interactionId:
              data?.id ||
              null,

            status:
              data?.status ||
              "completed",
          },
          {
            status: 200,
          }
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gemini connection error.";

        console.error(
          `Connection error for ${model}:`,
          message
        );

        errors.push({
          model,

          status: 0,

          error:
            message,
        });

        /*
         * Automatically continue
         * to next model.
         */

        continue;
      }
    }

    /*
     * ALL MODELS FAILED
     */

    console.error(
      "ALL GEMINI MODELS FAILED:"
    );

    console.error(
      JSON.stringify(
        errors,
        null,
        2
      )
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Medical Report AI is temporarily unavailable. All current Gemini models were unavailable.",

        models:
          errors,
      },
      {
        status: 503,
      }
    );
  } catch (error) {
    /*
     * Unexpected error
     */

    console.error(
      "REPORT ANALYZE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to analyze the medical report.",
      },
      {
        status: 500,
      }
    );
  }
}