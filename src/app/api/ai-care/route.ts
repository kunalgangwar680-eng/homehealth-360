import { NextResponse } from "next/server";

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
];

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GEMINI_API_KEY is missing from .env",
        },
        { status: 500 }
      );
    }

    const prompt = `
You are the Healthcare 360 AI Care Coordinator.

Your role is to provide simple, safe, general healthcare guidance.

Rules:
- Do not diagnose diseases.
- Do not prescribe medicines.
- Do not provide medicine dosage instructions.
- Do not replace a qualified doctor.
- For emergency symptoms, advise the user to seek immediate emergency medical care.
- Encourage consultation with a qualified doctor when appropriate.
- Keep answers simple and easy to understand.
- Respond in the same language as the user whenever possible.
- If the user writes in Hindi or Hinglish, respond in Hindi/Hinglish.
- Be helpful, calm and concise.

User message:
${message.trim()}
`;

    let lastError =
      "Gemini API request failed.";

    // Try multiple models
    for (
      let modelIndex = 0;
      modelIndex < MODELS.length;
      modelIndex++
    ) {
      const model =
        MODELS[modelIndex];

      // Try current model twice
      for (
        let attempt = 1;
        attempt <= 2;
        attempt++
      ) {
        try {
          console.log(
            `Trying Gemini model: ${model}, attempt: ${attempt}`
          );

          const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
                "x-goog-api-key":
                  apiKey,
              },

              body: JSON.stringify({
                model,
                input: prompt,
              }),
            }
          );

          const responseText =
            await response.text();

          console.log(
            `GEMINI STATUS [${model}]:`,
            response.status
          );

          console.log(
            `GEMINI RESPONSE [${model}]:`,
            responseText
          );

          let data: any = {};

          try {
            data = responseText
              ? JSON.parse(
                  responseText
                )
              : {};
          } catch {
            lastError =
              "Gemini returned an invalid response.";

            break;
          }

          // SUCCESS
          if (response.ok) {
            const reply =
              data?.output_text ||
              data?.steps
                ?.find(
                  (step: any) =>
                    step?.type ===
                    "model_output"
                )
                ?.content?.find(
                  (item: any) =>
                    item?.type ===
                    "text"
                )?.text;

            if (!reply) {
              lastError =
                "Gemini returned an empty response.";

              break;
            }

            return NextResponse.json({
              success: true,
              reply,
              model,
            });
          }

          // ERROR MESSAGE
          lastError =
            data?.error?.message ||
            data?.message ||
            `Gemini API request failed with status ${response.status}.`;

          // Retry temporary errors
          if (
            response.status === 429 ||
            response.status === 500 ||
            response.status === 502 ||
            response.status === 503 ||
            response.status === 504
          ) {
            console.log(
              `${model} temporarily unavailable.`
            );

            if (attempt === 1) {
              await sleep(1200);
              continue;
            }

            // Move to next model
            break;
          }

          // Permanent error
          return NextResponse.json(
            {
              success: false,
              error: lastError,
              code:
                data?.error?.status ||
                null,
            },
            {
              status: response.status,
            }
          );
        } catch (error: any) {
          console.error(
            `GEMINI FETCH ERROR [${model}]:`,
            error
          );

          lastError =
            error?.message ||
            "Unable to connect to Gemini.";

          // Retry network error once
          if (attempt === 1) {
            await sleep(1200);
            continue;
          }

          break;
        }
      }
    }

    // All models failed
    return NextResponse.json(
      {
        success: false,
        error:
          "AI service is temporarily busy. Please try again in a moment.",
        details: lastError,
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error(
      "GEMINI AI ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Something went wrong while connecting to Gemini.",
      },
      { status: 500 }
    );
  }
}