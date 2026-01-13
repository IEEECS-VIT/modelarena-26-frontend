"use client";

import { useState } from "react";
import Protected from "../components/Protected";

export default function SubmitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submitFile = async () => {
    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("https://api.modelarena.com/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setMessage("File uploaded successfully ✅");
    } catch (err) {
      setMessage("Error uploading file ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected>
      <h1>Submission Page</h1>

      {/* File Input */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      {/* Submit Button */}
      <button onClick={submitFile} disabled={loading}>
        {loading ? "Uploading..." : "Submit CSV"}
      </button>

      <p>{message}</p>
    </Protected>
  );
}
