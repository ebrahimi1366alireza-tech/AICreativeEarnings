const DISALLOWED_TASK_PATTERNS = [
  /\b(?:install|download)\s+(?:a\s+)?(?:mobile\s+)?games?\b/i,
  /\b(?:play|test)\s+(?:a\s+)?games?\s+(?:for|to earn)\b/i,
  /\bfake\s+(?:likes?|followers?|reviews?|votes?)\b/i,
  /\bpaid\s+(?:likes?|followers?)\b/i,
  /\b(?:fake\s+)?(?:likes?|followers?|reviews?|votes?)\b.*\b(?:buy|sell|paid|fake|manipulat(?:e|ion))\b/i,
  /\b(?:buy|purchase|sell)\s+(?:fake\s+)?(?:likes?|followers?|reviews?|votes?)\b/i,
  /\b(?:vote|engagement)\s+manipulation\b/i,
  /\b(?:pay|deposit)\s+(?:an?\s+)?(?:upfront\s+)?(?:fee|deposit|bond|stake)\b/i,
  /\b(?:mandatory|required)\s+(?:paid\s+)?(?:subscription|membership|deposit|bond|stake)\b/i,
  /\bfee\s+to\s+unlock\s+(?:tasks?|withdrawals?)\b/i,
  /\b(?:pay|send|transfer)\s+(?:money|funds|crypto|tokens?)\s+(?:first|before|in advance)\b/i
];

export function isDisallowedOpportunity(value = "") {
  const text = String(value);
  return DISALLOWED_TASK_PATTERNS.some((pattern) => pattern.test(text));
}
