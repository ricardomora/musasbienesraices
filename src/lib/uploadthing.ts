import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

/** Align with Biosite: UT may expose url on serverData, ufsUrl, or url. */
export function uploadThingFileUrl(file: {
  url?: string;
  ufsUrl?: string;
  serverData?: { url?: string | null } | null;
}): string | null {
  const url = (
    file.serverData?.url ||
    file.ufsUrl ||
    file.url ||
    ""
  ).trim();
  return url || null;
}
