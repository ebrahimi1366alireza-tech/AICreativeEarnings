const IMAGE_CREDITS = 2;
const VIDEO_CREDITS = 65;
const VIDEO_DURATION_SECONDS = 5;

function cleanPrompt(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 1000);
}

function estimateRunwayCost(kind) {
  if (kind === "image") return { credits: IMAGE_CREDITS, usd: 0.02, label: "۲ اعتبار، حدود ۰٫۰۲ دلار" };
  if (kind === "video") return { credits: VIDEO_CREDITS, usd: 0.65, label: "حدود ۶۵ اعتبار، ۰٫۶۵ دلار برای ۵ ثانیه" };
  throw new TypeError("unsupported generation kind");
}

function buildRunwayRequest(kind, prompt) {
  const promptText = cleanPrompt(prompt);
  if (!promptText) throw new TypeError("prompt is required");
  if (kind === "image") {
    return {
      endpoint: "/v1/text_to_image",
      body: { model: "gen4_image_turbo", promptText, ratio: "1080:1440" }
    };
  }
  if (kind === "video") {
    return {
      endpoint: "/v1/text_to_video",
      body: { model: "seedance2_5_flash", promptText, ratio: "480:854", duration: VIDEO_DURATION_SECONDS, audio: false }
    };
  }
  throw new TypeError("unsupported generation kind");
}

module.exports = { cleanPrompt, estimateRunwayCost, buildRunwayRequest };
