"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    // Mock local capture — backend arrives later with Clerk/Vercel
    await new Promise((resolve) => setTimeout(resolve, 650));
    const form = event.currentTarget;
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
      <div
        className="rounded-xl border border-pine/20 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm"
        role="status"
      >
        <p className="font-display text-2xl text-pine-deep">Listo.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Recibimos tu interés. Cuando abramos acceso, te escribimos con los
          siguientes pasos — sin spam ni llamadas agresivas.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => setStatus("idle")}
        >
          Enviar otra consulta
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-pine/15 bg-white/70 p-6 shadow-sm backdrop-blur-sm"
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
        className="h-11 w-full bg-pine text-primary-foreground hover:bg-pine-deep sm:w-auto sm:px-8"
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
