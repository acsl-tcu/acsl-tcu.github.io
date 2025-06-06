// フロント側（e.g., DataTable.tsx）
export const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  rowId: string
) => {
  const files = event.target.files ? Array.from(event.target.files) : null;
  console.log("Selected files:", files);
  if (!files) return;

  try {
    const formData = new FormData();

    formData.append('rowId', rowId); // ファイル名として使う
    const timestamp = Date.now();
    files.map((file, index) => {
      const count = index + 1; // ファイル名のカウント
      const filename = file.name || '';
      const ext = typeof filename === 'string'
        ? filename.split('.').pop() || 'jpg'
        : 'jpg';
      const finalName = `${rowId}_${count}_${timestamp}.${ext}`;
      console.log(`Appending file: ${finalName}`);
      if (file && file.size > 3 * 1024 * 1024) {
        alert('画像サイズは最大3MBまでです');
        return;
      }
      formData.append('file', file, finalName);
    })

    const res = await fetch('https://acsl-hp.vercel.app/api/upload-box', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    console.log("Response status:", res.status);
    console.log("Response headers:", res.headers.get('Content-Type'));
    if (!res.ok) throw new Error('アップロードに失敗しました');

    const data = await res.json();
    const imageUrl = data.urls;
    console.log("Uploaded image URL:", imageUrl);
    if (!imageUrl) throw new Error('画像URLが取得できませんでした');
    return { id: rowId, imageUrl };
  } catch (err) {
    console.error(err);
    alert('画像のアップロードに失敗しました');
  }
};