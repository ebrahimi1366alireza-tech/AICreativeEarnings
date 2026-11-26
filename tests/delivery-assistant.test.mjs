import test from "node:test";
import assert from "node:assert/strict";
import { prepareDeliveryPack } from "../lib/delivery-assistant.mjs";

const complete = {
  orderId: "ORD-104",
  brief: "Prepare a vertical product video and three thumbnails",
  clientName: "Client",
  deliveryChannel: "Agreed client portal",
  version: "v2",
  requiredAssets: ["final-video.mp4", "thumbnail-1.png", "thumbnail-2.png", "thumbnail-3.png"],
  includedAssets: ["final-video.mp4", "thumbnail-1.png", "thumbnail-2.png", "thumbnail-3.png"],
  format: "MP4 1080x1920; PNG",
  qcStatus: "ready_for_human_review",
  rightsStatus: "licensed"
};

test("complete pack is only ready for human approval and never sends or uploads", () => {
  const result = prepareDeliveryPack(complete);
  assert.equal(result.status, "ready_for_human_approval");
  assert.equal(result.humanApprovalRequired, true);
  assert.equal(result.sendPerformed, false);
  assert.equal(result.uploadPerformed, false);
  assert.equal(result.manifest.length, 4);
});

test("missing required assets require revision", () => {
  const result = prepareDeliveryPack({ ...complete, includedAssets: ["final-video.mp4"] });
  assert.equal(result.status, "revision_required");
  assert.equal(result.absentAssets.length, 3);
});

test("missing QC blocks readiness", () => {
  const result = prepareDeliveryPack({ ...complete, qcStatus: "not_reviewed" });
  assert.equal(result.status, "revision_required");
});

test("unknown rights require revision even when QC and assets are complete", () => {
  const result = prepareDeliveryPack({ ...complete, rightsStatus: "unknown" });
  assert.equal(result.status, "revision_required");
  assert.equal(result.rightsEvidenceVerification, "not_verified");
});

test("prohibited rights block delivery", () => {
  const result = prepareDeliveryPack({ ...complete, rightsStatus: "prohibited" });
  assert.equal(result.status, "blocked");
});

test("missing order, brief and asset lists cannot pass", () => {
  const result = prepareDeliveryPack({ qcStatus: "ready_for_human_review", rightsStatus: "licensed" });
  assert.equal(result.status, "revision_required");
  assert.deepEqual(result.missing.sort(), ["brief", "includedAssets", "orderId", "requiredAssets"]);
});

test("client details are not invented and draft remains unsent", () => {
  const result = prepareDeliveryPack({ ...complete, clientName: "" });
  assert.equal(result.recipientProvided, false);
  assert.match(result.clientMessageDraft, /^Hello,/);
  assert.equal(result.sendPerformed, false);
});

test("open corrections keep the pack in revision", () => {
  const result = prepareDeliveryPack({ ...complete, outstanding: ["Confirm final subtitle spelling"] });
  assert.equal(result.status, "revision_required");
});
