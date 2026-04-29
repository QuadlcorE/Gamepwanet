export type IgdbImageSize =
  | "thumb"
  | "cover_small"
  | "cover_big"
  | "cover_med"
  | "screenshot_med"
  | "screenshot_big"
  | "720p"
  | "1080p";

export function igdbImageUrl(url?: string, size: IgdbImageSize = "cover_big") {
  if (!url) {
    return "";
  }

  const normalized = url.startsWith("//") ? `https:${url}` : url;
  return normalized.replace("/t_thumb/", `/t_${size}/`);
}
