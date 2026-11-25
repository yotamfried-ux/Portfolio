// Verbatim excerpts from the project repositories (comments and formatting unchanged).
import type { Bilingual } from './locale'
export type Snippet = { file: string; lang: string; code: string; caption: Bilingual }
export const snippets: Record<string, Snippet> = {
  "tori": {
    "file": "modules/availability/slots.ts",
    "lang": "TypeScript",
    "code": "// Slot generation on real instants (pure). Weekly rules + dated exceptions + busy intervals + Clock → bookable starts.\n// Works in the business's local wall time and converts through platform/clock (one tz helper), so DST days are correct:\n// a local time skipped by DST yields no slot, a repeated hour yields the earlier occurrence once (never twice).\n// Tested with example + property tests (tests/unit/availability-slots.test.ts). The booking module (stage 4) supplies `busy`.\n\nexport const weekdayOfDate = (date: string): number => {\n  const [y, m, d] = date.split(\"-\").map(Number);\n  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();\n};\n\nfunction merge(ws: Window[]): Window[] {\n  const sorted = ws.filter((w) => w.to > w.from).sort((a, b) => a.from - b.from);\n  const out: Window[] = [];\n  for (const w of sorted) {\n    const last = out.at(-1);\n    if (last && w.from <= last.to) last.to = Math.max(last.to, w.to);\n    else out.push({ ...w });\n  }\n  return out;\n}\n\nfunction subtract(ws: Window[], cut: Window): Window[] {\n  return ws.flatMap((w) => {\n    if (cut.to <= w.from || cut.from >= w.to) return [w];\n    const parts: Window[] = [];\n    if (cut.from > w.from) parts.push({ from: w.from, to: cut.from });\n    if (cut.to < w.to) parts.push({ from: cut.to, to: w.to });\n    return parts;\n  });",
    "caption": {
      "en": "Availability windows: merging and cutting time ranges before slots are generated.",
      "he": "חלונות זמינות: איחוד וחיתוך טווחי זמן לפני יצירת השעות הפנויות."
    }
  },
  "sportreel": {
    "file": "pipeline/publishable_reel_policy.py",
    "lang": "Python",
    "code": "\"\"\"Per-athlete canonical publishable-reel business contract.\n\nThe renderer may create intermediate variants, but the operator should receive one\nsocial-ready output per part. Every eligible athlete must have one primary output\nthat passed deterministic technical checks, final QA, and upload to REVIEW, or the\nproduction business gate must fail with explicit evidence.\n\n\nMANIFEST_SCHEMA_VERSION = \"sportreel.publishable_reel_manifest.v1\"\nSTATE_RENDERED = \"RENDERED\"\nSTATE_QA_PENDING = \"QA_PENDING\"\nSTATE_QA_PASSED = \"QA_PASSED\"\nSTATE_UPLOAD_PENDING = \"UPLOAD_PENDING\"\nSTATE_UPLOADED = \"UPLOADED\"\nSTATE_QA_FAILED = \"QA_FAILED\"\nSTATE_UPLOAD_FAILED = \"UPLOAD_FAILED\"\nSTATE_REVIEW_REQUIRED = \"REVIEW_REQUIRED\"\nMAX_PUBLISHABLE_SECONDS = 90.0",
    "caption": {
      "en": "The publishable-reel contract: one output per part, explicit states, and hard limits.",
      "he": "חוזה הסרטון המוכן לפרסום: פלט אחד לכל חלק, מצבים מוגדרים ומגבלות קשיחות."
    }
  },
  "customer-churn-prediction": {
    "file": "churn_utils.py",
    "lang": "Python",
    "code": "import pandas as pd\n\ndef clean_total_charges(df):\n    \"\"\"Coerce TotalCharges to numeric and handle tenure==0 rows.\n\n    Args:\n        df (pd.DataFrame): Input DataFrame with TotalCharges and tenure if available.\n\n    Returns:\n        pd.DataFrame: DataFrame with TotalCharges cleaned.\n\n    Assumptions:\n        TotalCharges may contain whitespace; tenure==0 rows should map missing charges to 0.\n    \"\"\"\n    if \"TotalCharges\" in df.columns:\n        df[\"TotalCharges\"] = pd.to_numeric(df[\"TotalCharges\"].astype(str).str.strip(), errors=\"coerce\")\n        if \"tenure\" in df.columns:\n            df.loc[(df[\"tenure\"] == 0) & (df[\"TotalCharges\"].isna()), \"TotalCharges\"] = 0\n    return df",
    "caption": {
      "en": "The cleaning rule applied when scoring new customers, kept consistent with how the model was trained.",
      "he": "כלל הניקוי שמופעל בחיזוי לקוחות חדשים, בהתאמה לדרך שבה המודל אומן."
    }
  }
}
