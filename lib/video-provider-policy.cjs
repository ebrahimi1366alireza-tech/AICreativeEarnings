"use strict";

// Provider policy only. This module never calls a remote generator or spends credits.
const VIDEO_PROVIDERS = Object.freeze([
  { id: "dreamina", name: "Dreamina", mode: "manual_web", freeQuota: "account_dependent", apiEnabled: false, url: "https://dreamina.capcut.com/" },
  { id: "krea", name: "Krea", mode: "manual_web", freeQuota: "account_dependent", apiEnabled: false, url: "https://www.krea.ai/" },
  { id: "canva", name: "Canva", mode: "manual_web", freeQuota: "account_dependent", apiEnabled: false, url: "https://www.canva.com/" },
  { id: "capcut", name: "CapCut", mode: "manual_editor", freeQuota: "account_dependent", apiEnabled: false, url: "https://www.capcut.com/" },
  { id: "comfyui_wan", name: "ComfyUI + Wan", mode: "self_hosted_open_source", freeQuota: "hardware_required", apiEnabled: false, url: "https://github.com/comfyanonymous/ComfyUI" },
  { id: "runway_dev", name: "Runway Dev API", mode: "paid_api_disabled", freeQuota: "none", apiEnabled: false, url: "https://dev.runwayml.com/" }
]);

function listVideoProviders() {
  return VIDEO_PROVIDERS.map(provider => ({ ...provider }));
}

function getVideoProvider(id) {
  return VIDEO_PROVIDERS.find(provider => provider.id === id) || null;
}

function canInvokeVideoProvider(id, explicitBudgetApproval = false) {
  const provider = getVideoProvider(id);
  if (!provider) return false;
  // No provider API is enabled in this release. Even approval requires a separately
  // reviewed integration and server-side budget controls; this function never enables it.
  if (provider.mode === "paid_api_disabled") return false;
  return false;
}

module.exports = { VIDEO_PROVIDERS, listVideoProviders, getVideoProvider, canInvokeVideoProvider };
