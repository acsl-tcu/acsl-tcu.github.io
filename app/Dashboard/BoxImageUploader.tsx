'use client';

import { useState } from 'react';

export default function BoxImageUploader() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-box', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('アップロードに失敗しました');
    }

    const data = await res.json();
    return data.sharedUrl as string; // Boxの共有リンク
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setPreviewUrl(null);

    try {
      const sharedUrl = await handleUpload(file);
      setPreviewUrl(sharedUrl);
    } catch (err) {
      console.error(err);
      setError('アップロードに失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Boxに画像をアップロード:
      </label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {isUploading && <p className="text-blue-500 mt-2">アップロード中...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">アップロードされた画像:</p>
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="w-64 h-auto border rounded"
          />
        </div>
      )}
    </div>
  );
}
