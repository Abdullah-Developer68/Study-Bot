import type { DocumentData } from "@studybot/types";

// Convert input to Uint8Array
// ArrayBuffer: raw bytes with no indexing helper.
// Uint8Array: typed view over ArrayBuffer, where each element is one unsigned byte (0–255), so you can read/write each byte as like an array.
// Uint8Array lets parser libraries easily access binary data, while ArrayBuffer is the underlying raw data.
const toUint8Array = (data: DocumentData): Uint8Array => {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (typeof data === "string") return new TextEncoder().encode(data);
  throw new Error(
    "Unsupported data type: expected Uint8Array, ArrayBuffer, or string",
  );
};

// Convert Uint8Array to UTF-8 (text encoding standard) string. This gives readable text output from binary data.
const decodeUtf8 = (data: DocumentData): string => {
  return new TextDecoder("utf-8").decode(toUint8Array(data));
};

// Extract text from PDF file using unpdf (server-side compatible).
// Check Deno compatibility of unpdf; use npm import alias if needed.
const parsePDF = async (data: DocumentData): Promise<string> => {
  try {
    const uint8 = toUint8Array(data);
    // we are importing unpdf in here so its dynamic and only loaded when needed.
    const { extractText } = await import("npm:unpdf");
    //If result.text is not an array, it’s treated as a single text value (string/number/undefined)
    const result = await extractText(uint8);
    // If result.text is an array, join pages with blank lines; otherwise make it a string; then trim whitespace.
    const text = Array.isArray(result.text)
      ? result.text.join("\n\n")
      : String(result.text || "");

    return text.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error(`Failed to parse PDF: ${String(error)}`);
  }
};

// Extract text from Word documents (.docx, .doc)

const parseWord = async (data: DocumentData): Promise<string> => {
  try {
    const uint8 = toUint8Array(data);
    const mammoth = await import("npm:mammoth");
    const result = await mammoth.extractRawText({ buffer: uint8 });
    return String(result?.value || "").trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse Word document: ${error.message}`);
    }
    throw new Error(`Failed to parse Word document: ${String(error)}`);
  }
};

// Extract text from Excel spreadsheets (.xlsx, .xls)

const parseExcel = async (data: DocumentData): Promise<string> => {
  try {
    const uint8 = toUint8Array(data);
    // Prefer SheetJS in Deno. exceljs has Node-only internals.
    const XLSX = await import("npm:xlsx");
    const workbook = XLSX.read(uint8, { type: "array" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_csv(worksheet, { FS: " | " });
      if (sheetText.trim()) {
        text += `\n--- Sheet: ${sheetName} ---\n${sheetText}`;
      }
    });

    return text.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
    throw new Error(`Failed to parse Excel file: ${String(error)}`);
  }
};

// Extract text from PowerPoint presentations (.pptx)
 
const parsePowerPoint = async (data: DocumentData): Promise<string> => {
  try {
    const uint8 = toUint8Array(data);
    // officeparser may require Node; if incompatible, swap with alternate
    const { parseOfficeAsync } = await import("npm:officeparser");
    const result = await parseOfficeAsync(uint8);
    // result may include text in result?.text or body etc.
    return typeof result === "string"
      ? result
      : JSON.stringify(result, null, 2);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse PowerPoint: ${error.message}`);
    }
    throw new Error(`Failed to parse PowerPoint: ${String(error)}`);
  }
};

// Extract text from Markdown files (.md)
 
const parseMarkdown = (data: DocumentData): string => {
  try {
    return decodeUtf8(data).trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse Markdown: ${error.message}`);
    }
    throw new Error(`Failed to parse Markdown: ${String(error)}`);
  }
};

// Extract text from plain text files (.txt)

const parseText = (data: DocumentData): string => {
  try {
    return decodeUtf8(data).trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse text file: ${error.message}`);
    }
    throw new Error(`Failed to parse text file: ${String(error)}`);
  }
};

// Main document parser

const parseDocument = async (
  data: DocumentData,
  fileName: string,
  mimeType: string,
): Promise<string> => {
  if (!fileName || typeof fileName !== "string") {
    throw new Error("fileName is required");
  }

  const extension = fileName.toLowerCase().split(".").pop();

  switch (extension) {
    case "pdf":
      return await parsePDF(data);

    case "docx":
    case "doc":
      return await parseWord(data);

    case "xlsx":
    case "xls":
      return await parseExcel(data);

    case "pptx":
    case "ppt":
      return await parsePowerPoint(data);

    case "md":
      return parseMarkdown(data);

    case "txt":
      return parseText(data);

    default:
      throw new Error(
        `Unsupported file type: .${extension}. Supported types: PDF, Word (.docx/.doc), Excel (.xlsx/.xls), PowerPoint (.pptx/.ppt), Markdown (.md), Text (.txt)`,
      );
  }
};

// Validate file size (bytes)

const validateFileSize = (fileSize: number, maxSizeInMB = 10): boolean => {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  if (fileSize > maxBytes) {
    throw new Error(
      `File size exceeds maximum allowed size of ${maxSizeInMB}MB`,
    );
  }
  return true;
};

export {
  toUint8Array,
  decodeUtf8,
  parsePDF,
  parseWord,
  parseExcel,
  parsePowerPoint,
  parseMarkdown,
  parseText,
  parseDocument,
  validateFileSize,
};
