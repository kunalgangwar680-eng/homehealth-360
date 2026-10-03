import { NextResponse } from "next/server";

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const errors: Array<{
      model: string;
      status: number;
      error: string;
    }> = [];

    for (const model of MODELS) {
      console.log(`Testing Gemini model: ${model}`);

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1/interactions",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },

            body: JSON.stringify({
              model,

              input:
                "Reply with exactly: GEMINI CONNECTION WORKING",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          const message =
            data?.error?.message ||
            `Gemini returned HTTP ${response.status}`;

          console.error(`Gemini ${model} failed:`, message);

          errors.push({
            model,
            status: response.status,
            error: message,
          });

          continue;
        }

        let output = "";

        if (typeof data?.output_text === "string") {
          output = data.output_text;
        }

        if (!output && Array.isArray(data?.outputs)) {
          for (const item of data.outputs) {
            if (typeof item?.text === "string") {
              output = item.text;
              break;
            }

            if (Array.isArray(item?.content)) {
              for (const content of item.content) {
                if (typeof content?.text === "string") {
                  output = content.text;
                  break;
                }
              }
            }

            if (output) break;
          }
        }

        if (!output && typeof data?.output?.text === "string") {
          output = data.output.text;
        }

        if (!output && Array.isArray(data?.steps)) {
          for (const step of data.steps) {
            if (!Array.isArray(step?.content)) {
              continue;
            }

            for (const content of step.content) {
              if (typeof content?.text === "string") {
                output = content.text;
                break;
              }
            }

            if (output) break;
          }
        }

        return NextResponse.json({
          success: true,
          model,
          output,
          status: data?.status || null,
          interactionId: data?.id || null,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown Gemini error.";

        console.error(`Gemini ${model} connection error:`, message);

        errors.push({
          model,
          status: 0,
          error: message,
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "All Gemini models are currently unavailable.",
        models: errors,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("GEMINI TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Gemini error.",
      },
      { status: 500 }
    );
  }
}