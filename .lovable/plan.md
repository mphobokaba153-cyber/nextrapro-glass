# NextraPro Mentor Platform

## User-facing changes
- Add mentor registration and sign-in with username, email, phone, password, password confirmation, and a private Instagram link for review.
- Show an approval-pending screen after registration. Only the owner account `ricothefx@gmail.com` can review Instagram links and approve mentor accounts.
- Create a glassy mentor dashboard inspired by the supplied screenshots, using NextraPro branding and original styling: overview, EA management, signals, licenses, stats, wallet, and profile.
- Add NextraPro-branded MT4 and MT5 self-host EA downloads based on the supplied examples. Relay trade opens, closes, and stop-loss/take-profit updates to the NextraPro signal feed.

## Technical approach
- Enable Lovable Cloud for accounts, persistent profiles and approval status, EA/license records, and trade signals.
- Use secure email/password auth and a profile record for username, phone, and private Instagram URL. Keep authorization roles separate from profile data; enforce pending/approved access and owner-only approval on the server.
- Implement mentor dashboard screens and secure data access; store generated EA codes/license ownership and validate incoming EA events before saving or distributing them.
- Create original MQL4 and MQL5 source files and an authenticated ingestion endpoint, following the uploaded event types without copying the example branding or credentials.
- Keep existing NextraPro client app and public homepage intact while adding the mentor experience.

## Not included
- No Android/iOS native store release.
- No live brokerage account execution; the EAs relay trade events and do not place trades on behalf of clients.
- No email notifications until a verified sending domain is available.
