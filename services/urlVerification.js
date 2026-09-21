export const checkUrl = async (url) => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 5000);
    const title = html.match(/<title[^>]*>([^<]*)/i)?.[1] || "";
    if (/not found|404|unavailable|doesn.t exist/i.test(title)) return null;
    return res.url;
  } catch {
    return null;
  }
};
