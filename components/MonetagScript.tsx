import Script from "next/script";

/** In-Page Push — override with NEXT_PUBLIC_MONETAG_ZONE */
const DEFAULT_PUSH_ZONE = "10856787";
/** Vignette — override with NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE */
const DEFAULT_VIGNETTE_ZONE = "10856793";

export function MonetagScript() {
  const pushZone = process.env.NEXT_PUBLIC_MONETAG_ZONE?.trim() || DEFAULT_PUSH_ZONE;
  const vignetteZone =
    process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE?.trim() || DEFAULT_VIGNETTE_ZONE;

  return (
    <>
      <Script
        id="monetag-in-page-push"
        src="https://nap5k.com/tag.min.js"
        strategy="afterInteractive"
        data-zone={pushZone}
      />
      <Script
        id="monetag-vignette-devbloghub"
        src="https://n6wxm.com/vignette.min.js"
        strategy="afterInteractive"
        data-zone={vignetteZone}
      />
    </>
  );
}
