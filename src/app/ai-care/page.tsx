"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AICarePage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I’m your Healthcare 360 AI Care Coordinator. You can ask me any general health question, including personal health concerns. I’ll guide you safely and suggest when you should consult a doctor.",
    },
  ]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: trimmedMessage,
      },
    ];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      // Send only the recent conversation to keep the request fast.
      const recentConversation = updatedMessages.slice(-12);

      const conversation = recentConversation
        .map((item) => {
          const speaker =
            item.role === "user"
              ? "User"
              : "AI Care Coordinator";

          return `${speaker}: ${item.content}`;
        })
        .join("\n\n");

      const response = await fetch("/api/ai-care", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: trimmedMessage,
          conversation,
        }),
      });

      const responseText = await response.text();

      console.log("AI CARE HTTP STATUS:", response.status);
      console.log("AI CARE RAW RESPONSE:", responseText);

      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Server returned invalid response (${response.status}): ${
            responseText || "Empty response"
          }`
        );
      }

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} | ${
            data?.error || "No error message returned by server"
          } | ${data?.code || "no-code"}`
        );
      }

      const aiReply =
        data?.reply || "The AI returned an empty response.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: aiReply,
        },
      ]);
    } catch (error: any) {
      console.error("AI CARE FRONTEND ERROR:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: `AI Error: ${
            error?.message || "Unknown error"
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAction(action: string) {
    if (loading) return;

    if (action === "doctor") {
      router.push("/doctor-consult");
      return;
    }

    if (action === "lab") {
      router.push("/lab-tests");
      return;
    }

    if (action === "caregiver") {
      router.push("/caregiver-booking");
      return;
    }

    if (action === "records") {
      router.push("/health-records");
      return;
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6">
          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-6 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
                  Healthcare 360
                </p>

                <h1 className="text-3xl font-bold sm:text-4xl">
                  AI Care Coordinator
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Get guidance about personal health concerns, doctor
                  consultation, lab tests, health records and caregiver
                  services.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                🤖
              </div>

            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

          {/* Chat Header */}
          <div className="border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-xl">
                🩺
              </div>

              <div>
                <h2 className="font-semibold">
                  Healthcare 360 Assistant
                </h2>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  <span className="text-xs text-slate-400">
                    AI Care Coordinator
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">

            {messages.map((item, index) => {
              const isUser = item.role === "user";

              return (
                <div
                  key={`${item.role}-${index}`}
                  className={`flex ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                      isUser
                        ? "rounded-br-md bg-cyan-500 text-slate-950"
                        : "rounded-bl-md bg-slate-800 text-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-slate-800 px-5 py-4">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                      style={{
                        animationDelay: "0.15s",
                      }}
                    />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                      style={{
                        animationDelay: "0.3s",
                      }}
                    />

                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Quick Actions */}
          <div className="border-t border-slate-800 px-4 pt-4">

            <p className="mb-3 text-xs text-slate-500">
              Quick help
            </p>

            <div className="flex flex-wrap gap-2">

              {/* Doctor */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickAction("doctor")}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                👨‍⚕️ Doctor Consultation
              </button>

              {/* Lab */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickAction("lab")}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                🧪 Book Lab Test
              </button>

              {/* Caregiver */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickAction("caregiver")}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                👩‍⚕️ Caregiver
              </button>

              {/* Health Records */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickAction("records")}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                📋 Health Records
              </button>

            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="border-t border-slate-800 p-4"
          >

            <div className="flex gap-2 rounded-2xl border border-slate-700 bg-slate-950 p-2 focus-within:border-cyan-500/50">

              <input
                type="text"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                placeholder="Ask anything about your health..."
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600"
              />

              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "..." : "Send"}
              </button>

            </div>

            <p className="mt-3 text-center text-xs text-slate-600">
              AI guidance is for general information and does not replace
              a qualified medical professional.
            </p>

          </form>

        </div>
      </div>
    </main>
  );
}