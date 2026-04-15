import React from "react";

interface HeroSectionProps {
  url: string;
  children?: React.ReactNode;
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export default function HeroSection({ url, children }: HeroSectionProps) {
  const videoId = extractVideoId(url);

  if (!videoId) return null;

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}?` +
    new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: videoId,
      controls: "0",
      modestbranding: "1",
      rel: "0",
      iv_load_policy: "3",
      playsinline: "1",
    });

  return (
    <div className="relative w-full h-[40svh] min-h-130 overflow-hidden bg-black">
      {/* Background iframe */}
      <div className="absolute inset-0 pointer-events-none">
        <iframe
          className="
            absolute top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2
            border-0
            w-[max(100%,calc(40vh*16/9))]
            h-[max(100%,calc(100vw*9/16))]
          "
          src={embedUrl}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="hero-background"
        />
      </div>

      {/* Dark overlay */}
      <div className="
      absolute inset-0 
      bg-linear-to-t
      from-black
      via-black/30
      to-black
        pointer-events-none
      "/>

      {/* Foreground content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}