const MODES = {
  product: { label: "عکس محصول", instruction: "Create a premium commercial product photograph" },
  social: { label: "تبلیغ شبکه اجتماعی", instruction: "Create a polished social media advertising visual" },
  video: { label: "ویدئوی کوتاه", instruction: "Create a concise vertical short-form promotional video concept" },
  banner: { label: "بنر تبلیغاتی", instruction: "Create a clear, high-conversion advertising banner" }
};

const STYLES = {
  photoreal: "photorealistic, natural materials, realistic lighting, professional commercial photography",
  minimal: "minimal, clean composition, restrained palette, generous negative space",
  luxury: "premium luxury art direction, elegant materials, refined lighting, editorial quality",
  vibrant: "bold vibrant colors, energetic composition, strong visual hierarchy",
  editorial: "editorial art direction, thoughtful composition, authentic visual storytelling"
};

function clean(value, max) {
  return typeof value === "string" ? value.trim().replace(/[\\u0000-\\u001f\\u007f]/g, " ").slice(0, max) : "";
}

function buildCreativePrompt(input = {}) {
  const mode = MODES[input.mode] ? input.mode : "product";
  const style = STYLES[input.style] ? input.style : STYLES.photoreal;
  const subject = clean(input.subject, 500);
  if (!subject) throw new TypeError("subject is required");
  const audience = clean(input.audience, 180) || "general customers";
  const platform = clean(input.platform, 120) || "website and social media";
  const language = clean(input.language, 60) || "no text in image";
  const details = clean(input.details, 700);
  const format = mode === "video" ? "9:16 vertical, 6-12 seconds, clear opening hook, 3-4 visual beats, smooth transitions, clean ending frame" : clean(input.format, 100) || "4:5 portrait";
  const lines = [
    MODES[mode].instruction + " for: " + subject + ".",
    "Art direction: " + style + ".",
    "Target audience: " + audience + ".",
    "Placement: " + platform + ".",
    "Format: " + format + ".",
    "Text handling: " + language + ".",
    details ? "Additional requirements: " + details + "." : "",
    "Keep the main subject clear and correctly proportioned. Use a deliberate focal point, coherent lighting, clean edges, and commercially usable original visual elements.",
    "Avoid watermarks, brand logos not supplied by the client, fabricated product claims, distorted typography, extra limbs or objects, and misleading before/after effects."
  ];
  return lines.filter(Boolean).join("\\n");
}

module.exports = { buildCreativePrompt, MODES, STYLES };
