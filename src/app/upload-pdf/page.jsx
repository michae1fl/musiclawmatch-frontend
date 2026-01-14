"use client";

import { useState } from "react";

export default function UploadPDF() {
  const [uploadMode, setUploadMode] = useState("youtube"); // "pdf" or "youtube"
  const [pdfText, setPdfText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (uploadMode === "pdf" && !pdfText.trim()) {
      setMessage("Please paste some PDF content first");
      return;
    }

    if (uploadMode === "youtube" && !youtubeUrl.trim()) {
      setMessage("Please enter a YouTube URL");
      return;
    }

    setUploading(true);
    setMessage("Processing and uploading to knowledge base...");

    try {
      const endpoint =
        uploadMode === "pdf"
          ? "/api/chat/upload-pdf"
          : "/api/chat/upload-youtube";
      const body =
        uploadMode === "pdf"
          ? { pdfText: pdfText.trim() }
          : { youtubeUrl: youtubeUrl.trim() };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setMessage(
        "✓ Content uploaded successfully! The AI chatbot is now trained on this content.",
      );
      setPdfText("");
      setYoutubeUrl("");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(
        `✗ ${error.message || "Error uploading content. Please try again."}`,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-8 border border-[#E9EAEC] dark:border-[rgba(255,255,255,0.12)]">
        <h1 className="font-bold text-2xl text-[#0E0E0E] dark:text-[rgba(255,255,255,0.87)] mb-2">
          Upload Legal Knowledge
        </h1>
        <p className="text-sm text-[#8C9099] dark:text-[rgba(255,255,255,0.6)] mb-6">
          Train the AI legal assistant with YouTube videos or PDF content
        </p>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setUploadMode("youtube")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
              uploadMode === "youtube"
                ? "bg-[#000] dark:bg-[rgba(255,255,255,0.87)] text-white dark:text-[#121212]"
                : "bg-[#F7F8FA] dark:bg-[#121212] text-[#8C9099] dark:text-[rgba(255,255,255,0.6)] border border-[#E9EAEC] dark:border-[rgba(255,255,255,0.12)]"
            }`}
          >
            YouTube Video
          </button>
          <button
            onClick={() => setUploadMode("pdf")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
              uploadMode === "pdf"
                ? "bg-[#000] dark:bg-[rgba(255,255,255,0.87)] text-white dark:text-[#121212]"
                : "bg-[#F7F8FA] dark:bg-[#121212] text-[#8C9099] dark:text-[rgba(255,255,255,0.6)] border border-[#E9EAEC] dark:border-[rgba(255,255,255,0.12)]"
            }`}
          >
            PDF Text
          </button>
        </div>

        {/* YouTube Upload Mode */}
        {uploadMode === "youtube" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#0E0E0E] dark:text-[rgba(255,255,255,0.87)] mb-2">
              YouTube Video URL
            </label>
            <input
              type="text"
              className="w-full p-4 border border-[#E9EAEC] dark:border-[rgba(255,255,255,0.12)] rounded-xl bg-[#F7F8FA] dark:bg-[#121212] text-[#0E0E0E] dark:text-[rgba(255,255,255,0.87)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6F5CF8]"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={uploading}
            />
            <p className="text-xs text-[#8C9099] dark:text-[rgba(255,255,255,0.6)] mt-2">
              Paste a YouTube URL. The system will automatically extract and
              process the video transcript/captions.
            </p>
          </div>
        )}

        {/* PDF Upload Mode */}
        {uploadMode === "pdf" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#0E0E0E] dark:text-[rgba(255,255,255,0.87)] mb-2">
              PDF Content
            </label>
            <textarea
              className="w-full h-96 p-4 border border-[#E9EAEC] dark:border-[rgba(255,255,255,0.12)] rounded-xl bg-[#F7F8FA] dark:bg-[#121212] text-[#0E0E0E] dark:text-[rgba(255,255,255,0.87)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6F5CF8]"
              placeholder="Paste the text content of your PDF here..."
              value={pdfText}
              onChange={(e) => setPdfText(e.target.value)}
              disabled={uploading}
            />
            <p className="text-xs text-[#8C9099] dark:text-[rgba(255,255,255,0.6)] mt-2">
              Tip: Copy text from your PDF and paste it here. You can use online
              PDF to text converters if needed.
            </p>
          </div>
        )}

        {message && (
          <div
            className={`text-sm p-4 rounded-lg mb-4 ${
              message.startsWith("✓")
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : message.startsWith("✗")
                  ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={
            (uploadMode === "pdf" && !pdfText.trim()) ||
            (uploadMode === "youtube" && !youtubeUrl.trim()) ||
            uploading
          }
          className="w-full bg-[#000] dark:bg-[rgba(255,255,255,0.87)] text-white dark:text-[#121212] font-semibold text-sm py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {uploading ? "Processing..." : "Upload to Knowledge Base"}
        </button>

        <div className="mt-6 p-4 bg-[#F7F8FA] dark:bg-[#121212] rounded-lg border border-[#E9EAEC] dark:border-[rgba(255,255,255,0.12)]">
          <h3 className="font-semibold text-sm text-[#0E0E0E] dark:text-[rgba(255,255,255,0.87)] mb-2">
            {uploadMode === "youtube"
              ? "How to use (YouTube):"
              : "How to use (PDF):"}
          </h3>
          {uploadMode === "youtube" ? (
            <ol className="text-xs text-[#8C9099] dark:text-[rgba(255,255,255,0.6)] space-y-1 list-decimal list-inside">
              <li>Find a YouTube video with captions/subtitles enabled</li>
              <li>Copy the video URL from your browser</li>
              <li>Paste it into the input field above</li>
              <li>Click "Upload to Knowledge Base"</li>
              <li>The AI will extract the transcript and learn from it</li>
            </ol>
          ) : (
            <ol className="text-xs text-[#8C9099] dark:text-[rgba(255,255,255,0.6)] space-y-1 list-decimal list-inside">
              <li>Open your PDF file and copy all the text</li>
              <li>Paste the text into the textarea above</li>
              <li>Click "Upload to Knowledge Base"</li>
              <li>
                The AI chatbot will now use this information to answer questions
              </li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
