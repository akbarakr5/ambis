export const handleResponse = async (res: Response) => {
  if (res.ok) return res.json().catch(() => ({}));
  const text = await res.text().catch(() => '');
  let body: any = text;
  try { body = JSON.parse(text); } catch (e) {}
  const err = new Error(`HTTP ${res.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  (err as any).status = res.status;
  (err as any).body = body;
  throw err;
};
