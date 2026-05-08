# BAZODIAC / FuFirE Static Site

Vollständige statische Website ohne externe Runtime-Dependencies. Das Projekt ist für ein sauberes Railway-Deployment vorbereitet und nutzt einen kleinen Node.js-Server, der die statischen Dateien aus dem Repo-Root ausliefert.

## Dateien

- `index.html` – HTML-Einstiegspunkt
- `styles.css` – vollständiges Styling
- `app.js` – Interaktionen und Animationen
- `server.js` – statischer Produktionsserver für Railway und lokale Nutzung
- `railway.json` – Railway Build-/Deploy-Konfiguration inklusive Healthcheck
- `package.json` – npm-Skripte und Node-Version

## Lokal starten

```bash
npm run dev
```

Dann öffnen:

```txt
http://localhost:5173
```

Der Server bindet standardmäßig an `0.0.0.0:5173`. Für Produktionsumgebungen wird automatisch die von Railway gesetzte `PORT`-Variable verwendet.

## Railway Deployment

1. Repository mit Railway verbinden.
2. Railway erkennt das Projekt über `railway.json` und verwendet Nixpacks.
3. Der Deploy-Startbefehl ist:

   ```bash
   npm start
   ```

4. Railway prüft den Healthcheck unter:

   ```txt
   /healthz
   ```

Es sind keine Build-Artefakte, kein CDN und keine npm-Abhängigkeiten erforderlich.

## Checks

```bash
npm run check
```

Der Check validiert die Syntax des Node-Servers.

## Enthaltene Features

- Tech-Cosmic Dark Design im Stil BAZODIAC / FuFirE
- Zero-Shot Nature Distilled Mode mit Body-Class `nature`
- 3D Prompt Core mit CSS Perspective, Crystal, drei Orbit-Ringen und Cursor-Tilt
- Reduced-Motion-Fallback als statische 2D-Komposition
- Quantum Cursor Trail mit Canvas Alpha Decay, Dot, Aura und Interactive Hover Boost
- Touch- und Reduced-Motion-Deaktivierung für Cursor
- Kinetic Typography Laboratory mit Word-Spans, Scroll-Progress, CSS-Variablen, Stagger, Translate, Rotation, Skew, Opacity und Blur
- Companion Tabs Levi / Eve
- Vergleichsmodul Standard Astrology Apps vs. BAZODIAC

Keine CDN-Icons. Keine Build-Kette. Kein `node_modules`-Morast. Kleine Gnade.
