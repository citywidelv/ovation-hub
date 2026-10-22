# Ovation Hub

Client-facing hub for Ovation Property Management staff and the City Wide day porters on their
properties. Live at https://citywidelv.github.io/ovation-hub/

| Page | Who | Gate |
|---|---|---|
| `index.html` | Ovation staff, porters | Ovation passcode (script property `OV_PASSCODE`, kind `ov_auth`) |
| `report.html` | Ovation staff | same |
| `checklist.html` | Porters | same |
| `review.html` | City Wide FSMs | Team passcode (`cw-auth.js`, bounces to the Ops Hub gate) |

`ov-shared.js` carries the property list (41 Ovation communities, 12 awarded), the Aspire at
Redwood day porter workflow as the checklist, the gate, the post helper and the photo shrinker.
Pages paint with no fetch.

Backend: `Ovation.gs` in the CW Team Portal Backend project (prefix `ov_`). Storage is the
"CW Ovation Hub" Google Sheet (Reports, Checklists, Properties, Config) and the "CW Ovation Hub"
Drive folder (one JSON per submission, photos, PDFs). Both are created by the script on first use.

Porter checklists send no email. Reports and requests email `Config!report_notify`. The FSM
builds the PDF in the browser (jsPDF), edits what is on it, and sends it from the review queue.
