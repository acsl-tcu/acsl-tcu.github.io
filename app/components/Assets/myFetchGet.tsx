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

export async function myFetchGet(route: string, info: CRUDInfo): Promise<unknown[]> {
  try {
    let query = '';
    if ('Where' in info && info.Where) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(info.Where)) {
        params.append(key, String(value));
      }
      query = `?${params.toString()}`;
    }

    const res = await fetch(`${route}${query}`);
    if (!res.ok) {
      console.error('response.ok:', res.ok);
      console.error('response.status:', res.status);
      console.error('response.statusText:', res.statusText);
      if ('setError' in info && typeof info.setError === 'function') {
        info.setError('サーバーエラー');
      }
      throw new Error(res.statusText);
    }

    const json = await res.json();
    if ('set' in info && typeof info.set === 'function') {
      info.set(json);
    }
    return json;
  } catch (error) {
    console.error('通信に失敗しました', error);
    return [];
  }
}
