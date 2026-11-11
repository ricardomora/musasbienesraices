import type { Metadata } from "next";
import { BackendGate } from "@/components/system/backend-gate";
import { PublishWizard } from "@/components/sell/publish-wizard";

export const metadata: Metadata = {
  title: "Publicar inmueble",
};

export default function PublicarPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="publicar inmuebles">
        <PublishWizard />
      </BackendGate>
    </main>
  );
}
