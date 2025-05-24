export const myFetchGet = async (route: string, info: any) => {
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
};
