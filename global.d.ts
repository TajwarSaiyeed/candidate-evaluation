// new file: global.d.ts
declare module "pdfjs-dist/legacy/build/pdf" {
  import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
  export function getDocument(src: unknown): { promise: Promise<PDFDocumentProxy> };
  export const GlobalWorkerOptions: { workerSrc: string };
}

declare module "pdfjs-dist/legacy/build/pdf.worker?url" {
  const worker: string;
  export default worker;
}