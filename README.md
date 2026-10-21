# Better Finder

A free Finder replacement for macOS, made for people who work with media — video, motion design, After Effects.
Thumbnails and hover-scrubbing for video, Lottie / Rive / 3D previews, tabs and split panes, trim and compress,
automatic transcripts, a media player with a queue, and more.

**Website:** https://gmttuts.github.io/better-finder/
**Download:** the latest `.dmg` is on the [Releases](https://github.com/gmttuts/better-finder/releases/latest) page
(macOS 13 or later, Apple silicon and Intel).

## First launch

Better Finder isn't notarized by Apple, so macOS blocks it the first time:

- **macOS 15 or later:** open the app once, then System Settings ▸ Privacy & Security ▸ **Open Anyway**.
- **macOS 13–14:** Control-click the app in Applications ▸ **Open**.
- If macOS says the app **is damaged**, run this in Terminal, then open it again:
  `xattr -dr com.apple.quarantine "/Applications/Better Finder.app"`

The app checks for new versions once a day (Settings ▸ Updates).

---

This repository holds the website and the downloads only; the app's source code isn't published here.
