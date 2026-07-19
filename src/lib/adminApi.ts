export const adminFetch = async (url: string, init: RequestInit = {}) => {
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;

  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: isFormData
      ? (init.headers || {})
      : {
          'Content-Type': 'application/json',
          ...(init.headers || {}),
        },
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  return {
    ok: response.ok,
    status: response.status,
    body,
    response,
  };
};
