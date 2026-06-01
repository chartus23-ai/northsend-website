"use client";

import { createElement, useEffect } from "react";

/**
 * Wistia inline player wrapped in the brand-matched paper card.
 *
 * Loads Wistia's global player.js once + the media-specific embed
 * script on first mount. Both are async and don't block hydration.
 * The custom element <wistia-player> is registered by player.js after
 * it loads. We render it via React.createElement to avoid declaring
 * a JSX type for a non-standard HTML element.
 *
 * Player chrome colour (forest #1F6A4C), captions, autoplay, end
 * behaviour, etc. are configured inside Wistia's dashboard per media,
 * not here. Keeping this component dumb makes the embed easy to swap
 * if the VSL ever gets re-recorded.
 *
 * The :not(:defined) style draws the swatch thumbnail at correct
 * aspect ratio before Wistia's custom element upgrades.
 */
export function WistiaEmbed({
  mediaId,
  className = "",
}: {
  mediaId: string;
  className?: string;
}) {
  useEffect(() => {
    // Global player.js — only inject once across the page
    if (!document.querySelector('script[src="https://fast.wistia.com/player.js"]')) {
      const s = document.createElement("script");
      s.src = "https://fast.wistia.com/player.js";
      s.async = true;
      document.body.appendChild(s);
    }
    // Media-specific embed script
    const mediaSrc = `https://fast.wistia.com/embed/${mediaId}.js`;
    if (!document.querySelector(`script[src="${mediaSrc}"]`)) {
      const s = document.createElement("script");
      s.src = mediaSrc;
      s.async = true;
      s.type = "module";
      document.body.appendChild(s);
    }
    // No cleanup — removing the scripts would break other Wistia embeds
    // and the cost of leaving them is one network request total.
  }, [mediaId]);

  return (
    <>
      <style>{`
        wistia-player[media-id='${mediaId}']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');
          display: block;
          filter: blur(5px);
          padding-top: 56.25%;
        }
      `}</style>
      <div
        className={`relative aspect-video overflow-hidden rounded-2xl border border-paper-3 bg-paper-2 shadow-[0_20px_60px_-20px_rgba(11,19,14,0.25)] ${className}`}
      >
        {createElement("wistia-player", {
          "media-id": mediaId,
          aspect: "1.7777777777777777",
        })}
      </div>
    </>
  );
}
