"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

function Inbox() {
  const threads = useQuery(api.questions.inboxForSeller);
  const answer = useMutation(api.questions.answer);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold text-white">Preguntas recibidas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Responde desde aquí — el hilo queda público en la ficha del inmueble.
      </p>
      <ul className="mt-8 space-y-4">
        {(threads ?? []).map((t) => (
          <li
            key={t.question._id}
            className="rounded-xl border border-white/10 p-4"
          >
            <p className="text-xs text-muted-foreground">
              {t.askerName} ·{" "}
              <Link
                href={`/inmuebles/${t.listingSlug}`}
                className="text-neon hover:underline"
              >
                {t.listingTitle}
              </Link>
            </p>
            <p className="mt-2 text-white">{t.question.body}</p>
            {t.answer ? (
              <p className="mt-3 border-l-2 border-neon/40 pl-3 text-sm text-white/80">
                {t.answer.body}
              </p>
            ) : (
              <form
                className="mt-3 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void answer({
                    questionId: t.question._id as Id<"questions">,
                    body: drafts[t.question._id] ?? "",
                  })
                    .then(() => toast.success("Respondido"))
                    .catch((err) =>
                      toast.error(
                        err instanceof Error ? err.message : "Error",
                      ),
                    );
                }}
              >
                <label className="block space-y-1">
                  <span className="text-xs text-white/55">Tu respuesta</span>
                  <textarea
                    value={drafts[t.question._id] ?? ""}
                    onChange={(e) =>
                      setDrafts((d) => ({
                        ...d,
                        [t.question._id]: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Disponibilidad, visitas, documentos…"
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
                  />
                </label>
                <button
                  type="submit"
                  className="text-sm font-medium text-neon hover:underline"
                >
                  Publicar respuesta
                </button>
              </form>
            )}
          </li>
        ))}
        {threads?.length === 0 ? (
          <p className="text-muted-foreground">
            Sin preguntas todavía. Cuando un comprador pregunte en tu ficha,
            aparece aquí para responder.
          </p>
        ) : null}
      </ul>
    </div>
  );
}

export default function MensajesPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="mensajes">
        <DashboardNav />
        <Inbox />
      </BackendGate>
    </main>
  );
}
