"use client";
import { useState, useRef } from "react";
import { IconPlus } from "@tabler/icons-react";
import { ArrowUpIcon, X, FileText, Loader2, Square } from "lucide-react";
import useChatContext from "@/hooks/useChatContext";
import { uploadDocument } from "@/lib/api-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

const SUPPORTED_FILE_TYPES = [
  ".pdf",
  ".docx",
  ".doc",
  ".xlsx",
  ".xls",
  ".pptx",
  ".ppt",
  ".md",
  ".txt",
];
const MAX_FILE_SIZE_MB = 10;

// Validate file before upload
const validateFile = (file) => {
  // Check file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Current size: ${fileSizeInMB.toFixed(2)}MB`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = SUPPORTED_FILE_TYPES.some((ext) =>
    fileName.endsWith(ext),
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Unsupported file type. Supported formats: ${SUPPORTED_FILE_TYPES.join(", ")}`,
    };
  }

  return { valid: true, error: null };
};

const Input = () => {
  const [prompt, setPrompt] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, status, stop } = useChatContext();

  // isLoading is derived from status which is a state variable managed by useChat
  const isLoading = status === "submitted" || status === "streaming";

  // Handle file selection button click
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setUploadError(null);

    // Validate file using api-client utility
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      const data = await uploadDocument(file);

      setAttachedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        extractedText: data.extractedText,
        wasTruncated: data.wasTruncated,
      });
    } catch (error) {
      console.error("File upload error:", error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove attached file
  const handleRemoveFile = () => {
    setAttachedFile(null);
    setUploadError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || isUploading) return;

    // Get user's actual prompt
    const userPrompt = prompt.trim();

    // Build the full message content for AI (file content first, then user prompt)
    let messageForAI = userPrompt;
    if (attachedFile) {
      messageForAI = `[Document: ${attachedFile.name}]\n\n${attachedFile.extractedText}\n\n[User Request]: ${userPrompt}`;
    }

    // AI SDK 5.0+ expects a message object with parts, not a plain string
    // Send the full content to AI but it will be processed server-side
    sendMessage({
      role: "user",
      content: messageForAI,
    });

    setPrompt("");
    setAttachedFile(null);
    setUploadError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-3xl">
      {/* File attachment preview */}
      {attachedFile && (
        <div className="mb-2 flex items-center gap-2 bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 text-sm">
          <FileText size={16} className="text-blue-400 shrink-0" />
          <span
            className="text-blue-200 truncate flex-1"
            title={attachedFile.name}
          >
            {attachedFile.name}
          </span>
          {attachedFile.wasTruncated && (
            <span className="text-yellow-400 text-xs">(truncated)</span>
          )}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-blue-300 hover:text-white transition-colors p-1 rounded hover:bg-blue-800/50"
            title="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload error message */}
      {uploadError && (
        <div className="mb-2 flex items-center gap-2 bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-sm text-red-300">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-300 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <InputGroup className="w-full">
        <InputGroupTextarea
          placeholder={
            attachedFile
              ? "Ask a question about the document..."
              : "Ask, Search or Chat..."
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <InputGroupAddon align="block-end">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_FILE_TYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />

          {/* File upload button */}
          <InputGroupButton
            type="button"
            variant="outline"
            className="rounded-full"
            size="icon-xs"
            onClick={handleFileButtonClick}
            disabled={isLoading}
            title="Attach document (PDF, Word, Excel, PowerPoint, etc.)"
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <IconPlus />
            )}
          </InputGroupButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton type="button" variant="ghost">
                Tools
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="[--radius:0.95rem]"
            >
              <DropdownMenuItem>Auto</DropdownMenuItem>
              <DropdownMenuItem>Agent</DropdownMenuItem>
              <DropdownMenuItem>Manual</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupText className="ml-auto">52% used</InputGroupText>
          <Separator orientation="vertical" className="h-4" />

          {/* Send or Stop button */}
          {isLoading ? (
            <InputGroupButton
              type="button"
              variant="destructive"
              className="rounded-full cursor-pointer"
              size="icon-xs"
              onClick={stop}
              title="Stop generating"
            >
              <Square size={14} fill="currentColor" />
              <span className="sr-only">Stop</span>
            </InputGroupButton>
          ) : (
            <InputGroupButton
              type="submit"
              variant="default"
              className="rounded-full cursor-pointer"
              size="icon-xs"
              disabled={(!prompt.trim() && !attachedFile) || isUploading}
            >
              <ArrowUpIcon />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};

export default Input;
