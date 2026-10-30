# Sign Ready

A gentle British Sign Language (BSL) course for beginners, with signs for a GP surgery reception desk.
Lessons, practice taps, sound effects, daily streaks, a garden that grows, unit tests, a final test,
and daily reminder notifications on iPhone (iOS 16.4+, added to the Home Screen).

- `public/` is the app (served as static files).
- `worker.js` is a Cloudflare Worker that serves the app and sends the daily reminders.
  It needs no secrets: the notification keys are created automatically.
- `src/` holds the course content and app code. Run `python3 build.py` to rebuild `public/index.html`.

Sign descriptions are written from the British-Sign.co.uk BSL dictionary, which has an illustration and
video for each sign (linked from every sign card).
