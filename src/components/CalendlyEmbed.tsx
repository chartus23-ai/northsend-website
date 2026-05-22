"use client";

import { useEffect } from "react";

/**
 * Inline Calendly widget — brand-matched to the warm palette.
 *
 * Loads widget.js once on mount, then Calendly auto-initialises any
 * .calendly-inline-widget div on the page.
 *
 * Colour params (hex without the #):
 *   background_color = paper #FAF7F1
 *   text_color       = ink   #0B130E
 *   primary_color    = forest #1F6A4C
 *
 * Detail hiding:
 *   hide_event_type_details=1 — the headline + description are already
 *                                on the landing page, no need to repeat.
 *   hide_gdpr_banner=1        — quieter widget.
 */

const CALENDLY_URL = "https://calendly.com/charlie-northsend/30min";

const PARAMS = new URLSearchParams({
  // Show the event headline + description inside the widget so prospects
  // see "Guaranteed 10 Booked Patients In 90 Days" + the supporting copy
  // at the point of booking.
  hide_gdpr_banner: "1",
  background_color: "FAF7F1",
  text_color: "0B130E",
  primary_color: "1F6A4C",
});

const FULL_URL = `${CALENDLY_URL}?${PARAMS.toString()}`;

export function CalendlyEmbed({
  className = "",
  minHeight = 720,
}: {
  className?: string;
  minHeight?: number;
}) {
  useEffect(() => {
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // leave the script in place — removing it can break other Calendly instances
    };
  }, []);

  return (
    <div
      className={`calendly-inline-widget ${className}`}
      data-url={FULL_URL}
      style={{ minWidth: "320px", minHeight: `${minHeight}px` }}
    />
  );
}

export { CALENDLY_URL };
