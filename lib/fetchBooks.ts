export async function fetchBooks(token: string) {
  const res = await fetch('https://acsl-hp.vercel.app/api/books', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('認証に失敗しました');
  return await res.json();
}