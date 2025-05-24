// utils/fetchHelpers.ts

export async function sendRequest(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  body: any,
  isFormData: boolean = false
) {
  const options: RequestInit = {
    method,
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? body : JSON.stringify(body),
  };

  const res = await fetch(url, options);
  if (!res.ok) {
    console.error(`${method} ${url} failed:`, res.status, res.statusText);
    throw new Error(res.statusText);
  }
  return res.json();
}

export async function fetchData(url: string, info: any) {
  const params = info.Where ? `?where=${encodeURIComponent(info.Where)}` : '';
  const res = await fetch(`${url}${params}`);
  if (!res.ok) {
    console.error('Fetch failed:', res.status, res.statusText);
    throw new Error(res.statusText);
  }
  return res.json();
}
