'use client';

import { useState } from 'react';

export default function UploadBox() {
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('アップロード中...');
    try {
      const result = await handleUpload(file);
      setStatus(`アップロード成功！共有リンク: ${result.sharedUrl}`);
    } catch (err) {
      setStatus('アップロード失敗');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">ファイルを選択：</label>
      <input type="file" onChange={handleChange} />
      {status && <p className="mt-4 text-sm text-blue-600">{status}</p>}
    </div>
  );
}
