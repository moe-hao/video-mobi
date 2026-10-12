export const fetcher = async (...args: Parameters<typeof fetch>) => {
  console.log(args);
  const [input, init] = args;
  const headers = new Headers(init?.headers);

  headers.set('content-type', 'application/json');

  const token = localStorage.getItem('token');
  if (token) {
    headers.set('authorization', token);
  }

  const res = await fetch(input, { ...init, headers });
  const result = await res.json();
  return result.data;
};
