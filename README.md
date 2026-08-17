<div align="center">

<img src="https://b1ack.net/favicon.svg" alt="B1ack Logo" width="120" />

# B1ack — Official Website

**Calmness always here.**

</div>

The source of [b1ack.net](https://b1ack.net) — a fast, dependency-free static website built with plain **HTML, CSS, and JavaScript**. No frameworks, no build step, no bundler — just clean markup served straight to the browser.

---

## ✨ Overview

B1ack is the web presence for the B1ack project and the **B1ackOS GNU/Linux** distribution. Beyond the landing page, the site hosts a small collection of self-contained utility tools, all wrapped in a consistent, minimal design.

## 🧩 Features

- **Multilingual by design** — the entire site is fully localized into **English, Russian, German, French, and Georgian**, with proper `hreflang` alternates and a persistent language switcher.
- **Light & dark themes** — a one-click toggle with the preference remembered across visits.
- **Responsive navigation** — an adaptive header with a collapsible menu for smaller screens.
- **Weather lookup** — check the current forecast for any city in the world.
- **Browser fingerprint inspector** — see exactly what information your browser exposes about you.
- **Secure generator** — create strong passwords and random secure data on the fly.
- **Survival & technical guides** — reference pages covering practical knowledge and technical work.
- **Donation page** — a straightforward way to support the project.
- **SEO-conscious markup** — structured data, Open Graph and Twitter meta tags, canonical URLs, and a sitemap out of the box.
- **B1ackOS section** — a dedicated, localized hub presenting the B1ackOS GNU/Linux distribution.

## 🛠 Tech Stack

| Layer      | Technology                     |
|------------|---------------------------------|
| Markup     | Semantic HTML5                  |
| Styling    | Modern CSS3 (custom properties, no preprocessor) |
| Behavior   | Vanilla JavaScript (ES6+, no frameworks) |
| Tooling    | None required — open and go     |

The project deliberately avoids build tooling: everything renders as-is, keeping the codebase transparent, lightweight, and easy to audit.

## 🌍 Localization

Every core page is translated and served under its own language path, with automatic language detection and a dropdown for manual switching. Search engines are guided via `hreflang` alternates so each locale is indexed correctly.

## 🎨 Design Philosophy

The interface favors calm, minimal visuals — muted palettes, generous spacing, and subtle motion — echoing the project's own tagline. Both dark and light themes follow the same principles for a consistent feel in any lighting.

## 🚀 Getting Started

Since the site has no build dependencies, running it locally is trivial:

1. Clone the repository.
2. Serve the root directory with any static file server (or open the pages directly in a browser).
3. Browse — no installation, compilation, or package manager required.

## 🤝 Community

- **[Discord](https://discord.gg/NxZEbtEhAp)** — join the community for discussion and support.
- **[Telegram](https://t.me/B1ackOS)** — follow announcements and updates.
- **[GitHub](https://github.com/b1-ack)** — explore related projects, including B1ackOS itself.

## 🥚 Easter Egg

Refresh a language's root page **five times within a minute**, and instead of a sixth reload you'll be quietly redirected to the *Survive* page for that language, greeted with a short, encouraging message:

> **Live**
> Every day is a battle. But you're stronger than you think.

The site also ships a **sarcastic cookie-consent popup**. It pops up like any other cookie banner — except instead of asking you to accept anything, it simply informs you that there are no cookies to collect or store in the first place.

## 🔌 API

The website is backed by a small public API at **`api.b1ack.net`**, offering a handful of lightweight, no-auth endpoints:

| Endpoint | Description |
|---|---|
| `/ip` | Returns the caller's public IP address as JSON. |
| `/trace` | Returns diagnostic connection info, similar in spirit to Cloudflare's `1.1.1.1/cdn-cgi/trace`. |
| `/weather` | Proxies weather data for a given set of coordinates, returning current conditions as JSON. |
| `/issue` | Lets you file a GitHub issue directly via a POST request — the GitHub token used to authorize the request is kept server-side and never exposed to the client. |

To use `/weather`, send a `GET` request with `latitude`, `longitude`, the desired `current` parameters (e.g. temperature, weather code, wind speed), and a `timezone` — the response comes back as structured JSON.

To use `/issue`, send a `POST` request with a JSON body containing a `title`, a `body`, and optional `labels`, along with an `Origin` header identifying the calling site (e.g. `os.b1ack.net`). The API then opens the corresponding issue on GitHub on your behalf, without ever revealing the underlying credentials.

## 📄 License

Released under the **[GNU General Public License v3.0](https://github.com/b1-ack/website/blob/main/LICENSE)**. See the license file for full details on usage, modification, and distribution.

---

<div align="center">

### 🖥️ Looking for the operating system itself?

**This repository powers the website — the OS lives in its own project.**

Check out **[B1ackOS GNU/Linux](https://github.com/b1-ack/operating-system)**, a privacy-focused, Debian-based operating system built for simplicity and security.

[![Website](https://img.shields.io/badge/Website-os.b1ack.net-black)](https://os.b1ack.net/)

</div>

---

<p align="center">Made with care by the B1ack community.</p>
