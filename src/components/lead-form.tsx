"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LeadForm() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    // Mock local capture — backend arrives later with Clerk/Vercel
    await new Promise((resolve) => setTimeout(resolve, 650));
    const data = new FormData(form);
    if (!data.get("email") || !data.get("name")) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    form.reset();
  }

  if (status === "ok") {
    return (
      <motion.div
        className="glass rounded-xl p-6 text-left"
        role="status"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-display text-2xl text-neon">Listo.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Recibimos tu interés. Cuando abramos acceso, te escribimos con los
          siguientes pasos — sin spam ni llamadas agresivas.
        </p>
        <Button
          type="button"
          variant="outline"
          className="interactive-surface mt-5 border-white/15 bg-transparent hover:bg-white/5"
          onClick={() => setStatus("idle")}
        >
          Enviar otra consulta
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass space-y-4 rounded-xl p-6"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Ana Ruiz"
            required
            disabled={status === "sending"}
            className="interactive-surface border-white/10 bg-background/40"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ana@correo.com"
            required
            disabled={status === "sending"}
            className="interactive-surface border-white/10 bg-background/40"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <Input
          id="city"
          name="city"
          autoComplete="address-level2"
          placeholder="Ciudad de México"
          disabled={status === "sending"}
          className="interactive-surface border-white/10 bg-background/40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">¿Qué quieres vender o publicar?</Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Departamento en Polanco, casa en GDL, terreno…"
          disabled={status === "sending"}
          className="interactive-surface border-white/10 bg-background/40"
        />
      </div>
      {status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          Necesitamos al menos tu nombre y correo para contactarte.
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        className="interactive-surface h-11 w-full bg-neon text-primary-foreground shadow-[0_0_36px_-14px_color-mix(in_srgb,var(--neon)_75%,transparent)] hover:bg-white hover:text-ink sm:w-auto sm:px-8"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando…" : "Quiero acceso anticipado"}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Formulario local de demostración. No se envía a un servidor todavía.
      </p>
    </form>
  );
}
