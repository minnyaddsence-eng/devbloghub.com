import Script from "next/script";

/** In-Page Push — override with NEXT_PUBLIC_MONETAG_ZONE */
const DEFAULT_PUSH_ZONE = "10856787";
/** Vignette — override with NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE */
const DEFAULT_VIGNETTE_ZONE = "10856793";
/** OnClick (popunder) — override with NEXT_PUBLIC_MONETAG_ONCLICK_ZONE; set NEXT_PUBLIC_MONETAG_ONCLICK_DISABLED=true to skip */
const DEFAULT_ONCLICK_ZONE = "10858167";

export function MonetagScript() {
  const pushZone = process.env.NEXT_PUBLIC_MONETAG_ZONE?.trim() || DEFAULT_PUSH_ZONE;
  const vignetteZone =
    process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE?.trim() || DEFAULT_VIGNETTE_ZONE;
  const onclickDisabled = process.env.NEXT_PUBLIC_MONETAG_ONCLICK_DISABLED === "true";
  const onclickZone = onclickDisabled
    ? null
    : process.env.NEXT_PUBLIC_MONETAG_ONCLICK_ZONE?.trim() || DEFAULT_ONCLICK_ZONE;

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
      {onclickZone ? (
        <Script
          id="monetag-onclick"
          src="https://al5sm.com/tag.min.js"
          strategy="afterInteractive"
          data-zone={onclickZone}
        />
      ) : null}
    </>
  );
}
