import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ConversationItem = {
  role?: string;
  text?: string;
  content?: string;
};

function responseJson(
  data: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function getApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ""
  ).trim();
}

function getSystemPrompt() {
  return `
You are Healthcare 360 AI Care Pilot.

You are a healthcare information and care coordination assistant.

Your role is to help users understand healthcare information and navigate the Healthcare 360 platform.

You can help with:

- General health information
- Understanding health reports
- Preparing questions for doctors
- Doctor consultation preparation
- Lab test information
- Health records
- Health timeline
- Care gaps
- Health reminders
- Caregiver services
- Family healthcare
- Healthcare navigation

Medical safety:

- You are not a doctor.
- Do not diagnose diseases.
- Do not prescribe medicines.
- Do not change medication doses.
- Do not tell users to stop prescribed medicines.
- Do not make definitive medical claims.
- Encourage professional medical advice for important medical decisions.
- If a user describes a possible emergency, advise them to seek urgent medical care or local emergency services.
- Never invent patient information or medical records.

Communication:

- Be calm and human.
- Use simple language.
- Keep answers practical.
- Avoid unnecessary medical jargon.
- Use bullets when useful.
- Do not sound robotic.

Healthcare 360 features include:

Doctor consultation
Lab tests
Caregiver booking
Health records
Health timeline
Care gaps
Reminders
AI Care Pilot
Family healthcare

AI Care Pilot provides information and care coordination support.
It does not replace a qualified healthcare professional.
`;
}

function buildConversation(
  conversation: ConversationItem[]
) {
  return conversation
    .filter((item) => {
      return (
        item &&
        typeof item === "object" &&
        typeof (
          item.text ||
          item.content
        ) === "string"
      );
    })
    .slice(-20)
    .map((item) => {
      const text = String(
        item.text ||
          item.content ||
          ""
      ).trim();

      return {
        role:
          item.role === "assistant" ||
          item.role === "model"
            ? "model"
            : "user",

        parts: [
          {
            text,
          },
        ],
      };
    })
    .filter(
      (item) =>
        item.parts[0].text.length > 0
    );
}

async function generateWithGemini(
  model: string,
  apiKey: string,
  message: string,
  conversation: ConversationItem[]
) {
  const contents = [
    ...buildConversation(conversation),
    {
      role: "user",
      parts: [
        {
          text: message,
        },
      ],
    },
  ];

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",

      "x-goog-api-key": apiKey,
    },

    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: getSystemPrompt(),
          },
        ],
      },

      contents,

      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 1200,
      },
    }),
  });

  const raw = await response.text();

  let data: any;

  try {
    data = raw
      ? JSON.parse(raw)
      : null;
  } catch {
    throw new Error(
      `Gemini returned invalid JSON. HTTP ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Gemini API error: HTTP ${response.status}`
    );
  }

  const parts =
    data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    throw new Error(
      "Gemini response did not contain content parts."
    );
  }

  const reply = parts
    .map((part: any) =>
      typeof part?.text === "string"
        ? part.text
        : ""
    )
    .join("")
    .trim();

  if (!reply) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return reply;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const message =
      typeof body?.message ===
      "string"
        ? body.message.trim()
        : "";

    const conversation =
      Array.isArray(
        body?.conversation
      )
        ? body.conversation
        : [];

    if (!message) {
      return responseJson(
        {
          success: false,
          error:
            "Message is required.",
        },
        400
      );
    }

    if (message.length > 5000) {
      return responseJson(
        {
          success: false,
          error:
            "Message is too long.",
        },
        400
      );
    }

    const apiKey = getApiKey();

    if (!apiKey) {
      return responseJson(
        {
          success: false,
          error:
            "GEMINI_API_KEY is missing from .env",
        },
        500
      );
    }

    /*
     * Try the models one by one.
     * If one model is unavailable,
     * the next one will be attempted.
     */

    const models = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
    ];

    let lastError =
      "No Gemini model succeeded.";

    for (const model of models) {
      try {
        console.log(
          `[AI CARE PILOT] Trying model: ${model}`
        );

        const reply =
          await generateWithGemini(
            model,
            apiKey,
            message,
            conversation
          );

        console.log(
          `[AI CARE PILOT] Success: ${model}`
        );

        return responseJson({
          success: true,

          reply,

          model,
        });
      } catch (error) {
        lastError =
          error instanceof Error
            ? error.message
            : String(error);

        console.error(
          `[AI CARE PILOT] ${model} failed:`,
          lastError
        );
      }
    }

    return responseJson(
      {
        success: false,

        error:
          "All Gemini models failed.",

        details: lastError,
      },
      503
    );
  } catch (error) {
    console.error(
      "[AI CARE PILOT] Server error:",
      error
    );

    return responseJson(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      500
    );
  }
}