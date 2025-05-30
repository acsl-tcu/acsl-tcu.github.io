const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload-box', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  console.log('Uploaded:', data);
};
