# Tori private recording masters

Captured on 19 November 2026 from the actual Tori application in Hebrew, with synthetic fixture data and a local PostgreSQL, GoTrue, and PostgREST stack. Playwright recorded WebM originals. FFmpeg trimmed startup frames and transcoded the masters. The calendar trim removed the local booking URL visible during initialization.

Tori capture commit: `b776bf5bed1130ff9ac04aedb7d171a49896ec8b`.

All masters use H.264 MP4, yuv420p, faststart, and no audio. Paths below are relative to `assets/source/tori/`. The [manifest](manifest.json) also records bytes and MD5 for file reconciliation.

| File | Scene | Duration | Resolution | SHA-256 |
| --- | --- | ---: | --- | --- |
| [booking-desktop.mp4](booking-desktop.mp4) | Full desktop booking | 7.840 s | 1920 × 1080 | `218150bb8d670bb4171e7d059c75805158e8b3ab7205d263f22bc17c54025bf4` |
| [calendar-owner.mp4](calendar-owner.mp4) | New booking in the business owner's calendar | 5.040 s | 1920 × 1080 | `ece028f7a4a94c0564e998af0b05a6911639f98ad61db3fdd6496e425da9a89e` |
| [availability-settings.mp4](availability-settings.mp4) | Owner adjusts working hours and checks the public slots | 9.120 s | 1920 × 1080 | `4a1e4300867f0951dc49e97e86f24182f421fee111176b6cef3708bad7767527` |
| [confirmation-preview.mp4](confirmation-preview.mp4) | Customer confirmation and appointment details, with no email delivery | 2.760 s | 1920 × 1080 | `c232446a6fa3f44b8fccea2f9e91d086c6d88c0b192d134c8518274afc94d88f` |
| [booking-mobile.mp4](booking-mobile.mp4) | Full mobile booking | 7.720 s | 390 × 844 | `bb5c9bf905276809bfb3f73ca7ab498c2dceb465145e07a5e419ed346d07943c` |

The availability recording shows a saved Sunday closing-time change and the resulting public slot list. The confirmation recording shows the real customer-facing appointment details. No email inbox or delivered notification is demonstrated. All recordings use disposable identities and bookings.

See the [capture and Drive workflow](../../../docs/TORI_MEDIA_WORKFLOW.md).
