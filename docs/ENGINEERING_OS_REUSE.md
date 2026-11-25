# Engineering-OS reuse

Reviewed the private Engineering-OS repository at `477a27d` as a design reference. Portfolio UI and artwork were authored here. The app has no Engineering-OS runtime dependency.

| Source path | Adopted pattern | Portfolio location | Verification |
| --- | --- | --- | --- |
| `docs/ui-ux/EXPERIENCE-ROUTING.md` | Landing-page, new-screen, interaction, and quality review routes | Homepage, case study, and contact routes | Playwright navigation and interaction tests |
| `docs/product-experience/README.md` and `premium-motion-and-design-systems.md` | Editorial hierarchy, consistent geometry, restrained transform motion, and reduced-motion support | `src/app/globals.css`, `src/components/site.tsx`, `src/components/video.tsx` | Desktop and mobile layouts, automated reduced-motion assertion |
| `patterns/ui/README.md` | Semantic token aliases, reusable components, documented interaction states, and logical layout properties | CSS tokens and `src/components/` | Lint, typecheck, and desktop/mobile accessibility scans |
| `docs/ui-ux/SCREEN-CONTENT-PLAYBOOK.md` | Task-specific action labels, explicit pending content, and validation and recovery copy | `src/lib/projects.ts` and `src/components/contact-form.tsx` | Project provenance assertions and contact draft E2E |
| `docs/ui-ux/MOTION-AND-INTERACTIONS.md` | Native controls, visible selection, keyboard input, and reduced motion | `src/components/lab.tsx` and `src/app/globals.css` | Keyboard sliders, stage buttons, touch layout, and reduced motion |
| `docs/ui-ux/PRODUCT-EXPERIENCE-QUALITY-GATE.md` | Verify task completion on a running build and record the evidence | `tests/` and PR review captures | Playwright desktop/mobile runs and screenshots |
| `capability-registry/ROUTING-MAP.md` and `docs/reference-repositories/{nextjs-examples,playwright-examples}.md` | Framework-native routes, rendering boundaries, and deterministic browser verification | `src/app/[locale]/`, `playwright.config.ts` | Production build, locale routing, responsive E2E |

The catalog entry at `external-skills/ui-ux-pro-max/README.md` was reviewed. The referenced upstream repository reports MIT licensing, and the CLI was absent from this environment. No installation or execution of the skill was needed for this approved design.

The UI candidates in `docs/product-experience/ui-library-candidates-2026.md` informed the adoption decision. Native buttons, ranges, and CSS handled the work with a smaller dependency footprint. Animate UI, Uiverse, Vengeance UI, Forge UI, and UI Lora were not installed or copied. No license authorization was inferred from the catalog. The two self-hosted variable fonts, Manrope and Heebo, are distributed under the SIL Open Font License through the locked Fontsource packages.

## Update 2026-11-25: UI/UX skill installed
`ui-ux-pro-max` was installed on the working host with `python3 tools/eos_capabilities.py ensure --tool ui-ux-pro-max` (Claude plugin, v2.15.0). Its Forms & Feedback rules (inline validation, error placement with aria-describedby, required markers, submit feedback) were applied to the contact form; see the contact UX change.
