import {
  GlobalWorkerOptions,
} from "pdfjs-dist/legacy/build/pdf";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function extractTextFromPDF(base64: string): Promise<string> {
  if (!base64.includes(",")) {
    throw new Error("Invalid base64 format");
  }

  const base64WithoutPrefix = base64.split(",")[1];
  if (!base64WithoutPrefix) {
    throw new Error("Failed to extract base64 content");
  }
  let decodedString = "";
  try {
    decodedString = atob(base64);
  } catch (error) {
    console.error("Error decoding base64 string:", error);
  }

  return decodedString;
}
