// utils/fetchHelpers.ts

import { CRUDInfo } from './types';

export async function sendRequest(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  body: BodyInit,
  isFormData: boolean = false
): Promise<any> {
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

export async function fetchData(url: string, info: CRUDInfo): Promise<unknown[]> {
  const params = info.Where ? `?where=${encodeURIComponent(String(info.Where))}` : '';
  const res = await fetch(`${url}${params}`);
  if (!res.ok) {
    console.error('Fetch failed:', res.status, res.statusText);
    throw new Error(res.statusText);
  }
  return res.json();
}
