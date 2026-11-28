# Phone verification support — product requirement

Status: product requirement recorded; UI, database migration, and SMS integration are not implemented by this document.

## Purpose
Treat phone-number verification as a separate eligibility and account-readiness dimension in AI Creative Earnings. It can help identify platforms that allow account creation or work access with a verified phone number, without misrepresenting it as government identity verification.

## User profile fields
- Phone country (ISO 3166-1 alpha-2; e.g. AM).
- Phone number stored in normalized E.164 form and protected as personal data.
- Verification status: not_added, pending, verified, failed, expired.
- Verification method: SMS_OTP or voice_OTP.
- Verified timestamp and provider reference only; never store OTP codes.
- User controls: add, change, and remove number; explicit consent before sending an OTP.

## Opportunity-level verification requirements
Record separately:
- phone_required: yes / no / unknown.
- phone_verification_stage: signup / before_work / before_withdrawal / risk_review / unknown.
- accepted_phone_countries: explicit country list or unknown.
- phone_type_policy: mobile_only / landline_allowed / virtual_number_allowed / virtual_number_blocked / unknown.
- phone_ownership_check: OTP_access_only / carrier_owner_match / unknown.
- phone_evidence_url and evidence_checked_at.

## Critical distinctions
- A successful OTP proves access to a phone number at that time; it does not prove citizenship, legal residence, identity, or ownership unless the platform explicitly performs a separate carrier ownership check.
- Phone verification never replaces passport/document KYC, liveness, proof of address, sanctions screening, or payout-provider checks.
- Evaluate registration, ability to perform work, and withdrawal as separate stages. A platform may permit signup with a phone but request document KYC before withdrawal.
- Unknown requirements remain visible as unknown/unverified. Do not infer acceptance from the country calling code or from an OTP screen.
- Do not use rented, borrowed, spoofed, or third-party numbers to misrepresent identity or location. The user must control the number and complete OTP personally.
- Never store OTP values, recovery codes, passwords, or carrier-account credentials.

## Privacy and implementation safeguards
- Prefer a reputable SMS verification provider only after cost, regional coverage, data processing, and retention terms are reviewed. No paid provider or billing activation without explicit user approval.
- Do not expose full phone numbers in logs, analytics, public pages, or assistant prompts. Mask numbers in the UI.
- Rate-limit OTP requests and verification attempts; expire codes; prevent enumeration; use HTTPS; keep provider secrets server-side.
- Require explicit user action for each OTP send and verification. No background SMS or automated account verification.
- Do not add phone verification as a substitute for official identity checks in opportunity triage.

## Acceptance criteria
1. User can record a phone number and country without verifying it.
2. UI clearly distinguishes “number added” from “number verified”.
3. Opportunity cards show phone requirement and the stage at which it applies.
4. Country acceptance is evidence-backed and independent of nationality/residence eligibility.
5. Signup, work access, and withdrawal eligibility remain separate statuses.
6. No OTP is stored; secrets remain server-side; phone data is masked.
7. If SMS provider configuration is absent, the feature reports unavailable and does not imply verification succeeded.
8. Existing KYC, Iranian-nationality, Armenia-residence, and crypto-payout checks remain independent.
