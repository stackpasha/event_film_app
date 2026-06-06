<div align="center">

# 📸 EVENT FILM

### 🎞️ POV Gallery & Camera

**A cinematic, analog-inspired event photo sharing experience.**<br/>
**No accounts. No installs. Just open, shoot, and share.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)

<br/>

---

*Turn any event into a collaborative film roll.*<br/>
*Guests capture. Chemistry develops. Memories stay.*

---

</div>

<br/>

## 🔮 What is this?

**EVENT FILM** reimagines event photography through the aesthetic of analog film. Instead of yet another cloud gallery, your guests step into a **viewfinder** — complete with shutter sounds, a flash capacitor whine, and a chemical development process that makes every photo feel *earned*.

Hosts create event rolls. Guests join with a code. Everyone shoots on the same film.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   HOST creates event    →    Shares access code         │
│                                                         │
│   GUEST enters code     →    Camera viewfinder opens    │
│                                                         │
│   📸 SHUTTER fires      →    Film starts developing     │
│                                                         │
│   ⏱️  PROCESSING (15s)  →    DEVELOPING  →  DRYING      │
│                                                         │
│   🖼️  Photo READY       →    Appears in shared gallery  │
│                                                         │
│   📦 DOWNLOAD ALL       →    Client-side ZIP export     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 📷 Analog Camera Experience
- Full viewfinder UI with focus brackets & frame counter
- WebRTC live camera stream (front/rear toggle)
- Physical shutter button with haptic vibration
- Flash toggle with capacitor recharge SFX
- File upload fallback for devices without camera access

</td>
<td width="50%">

### 🧪 Film Development Simulation
- 3-stage pipeline: **Processing → Developing → Drying**
- Real-time countdown timers per photo
- Animated spinner states in gallery & dashboard
- Photos are "locked" until chemistry completes
- Vintage canvas filter with sepia, vignette & grain

</td>
</tr>
<tr>
<td width="50%">

### 🎛️ Host Dashboard
- Bento-grid stats: photos captured & guests joined
- Live/synced guest status indicators
- Horizontal film strip preview of latest captures
- One-click share of event access codes
- Create unlimited event rolls with custom settings

</td>
<td width="50%">

### 🖼️ Shared Gallery
- Responsive masonry layout (2-col mobile, 3-col desktop)
- Development status cards with live countdowns
- Frame number overlays on every exposure
- One-click **ZIP export** of all developed photos
- Powered by JSZip — fully client-side packaging

</td>
</tr>
<tr>
<td width="50%">

### 🔊 Synthesized Audio
- Shutter click: bandpass noise burst + triangle oscillator
- Flash recharge: rising sine wave capacitor whine
- UI haptic beep: quick sine pop for interactions
- All generated via **Web Audio API** — zero audio files

</td>
<td width="50%">

### 💾 Zero-Backend Architecture
- 100% client-side — no server, no database
- State persisted in `localStorage` with auto-migration
- Multi-event support with independent film rolls
- Guest & Host role system with PIN authentication
- Works offline after initial load

</td>
</tr>
</table>

<br/>

## 🎨 Design Philosophy

<div align="center">

| Principle | Implementation |
|:---|:---|
| **Dark-mode first** | Material Design 3 color system with `surface`, `primary-container`, and `outline-variant` tokens |
| **Glassmorphism** | High-refraction backdrop blur panels (`blur(20px)`) with translucent backgrounds |
| **Film grain** | Persistent `stardust` texture overlay at 5% opacity across the entire viewport |
| **Analog typography** | `Inter` for UI, `JetBrains Mono` for metadata — mimicking camera LCD readouts |
| **Micro-animations** | Shutter flash, input shake feedback, progress bars, toast notifications, developing spinners |
| **Mobile-first** | Responsive breakpoints, bottom navigation, touch-optimized controls |

</div>

<br/>

## 🚀 Quick Start

**No build tools. No dependencies to install. Just a browser.**

```bash
# Clone the repo
git clone https://github.com/stackpasha/event-film-app.git

# Open it
cd event-film-app
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### 🧪 Demo Credentials

| Mode | Input | Code |
|:---|:---|:---|
| 👤 **Guest** | Event Access Code | `SUMMER-24` |
| 👑 **Host** | Host Access PIN | `HOST-4921` |

> **Tip:** Enter any non-existing Host PIN to trigger the **Create New Event** flow.

<br/>

## 🗂️ Project Structure

```
event_film_app/
├── index.html      # Single-page HTML shell — all screens, modals & navigation
├── styles.css      # Custom CSS — grain overlay, glass panels, masonry, animations
├── app.js          # Full SPA logic — state engine, camera, audio, rendering
└── README.md       # You are here
```

### Architecture at a Glance

```
┌──────────────────────────────────────────────────────────────┐
│                        index.html                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  JOIN    │ │  CAMERA  │ │  GALLERY │ │   DASHBOARD    │  │
│  │  SCREEN  │ │  SCREEN  │ │  SCREEN  │ │   SCREEN       │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│  ┌──────────────────┐  ┌─────────────────────────────────┐  │
│  │  MODALS          │  │  BOTTOM NAV (Host only)         │  │
│  │  • Success       │  └─────────────────────────────────┘  │
│  │  • Disconnect    │                                       │
│  │  • Create Event  │                                       │
│  └──────────────────┘                                       │
└──────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │      app.js        │
                    │                    │
                    │  EventFilmApp {    │
                    │    state           │  ←→  localStorage
                    │    initCamera()    │  ←→  WebRTC
                    │    initAudio()     │  ←→  Web Audio API
                    │    capturePhoto()  │  ←→  Canvas 2D
                    │    downloadZip()   │  ←→  JSZip
                    │    render*()       │  →   DOM updates
                    │  }                 │
                    └────────────────────┘
```

<br/>

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Structure** | HTML5 | Semantic single-page shell with 4 screens + 3 modals |
| **Styling** | Tailwind CSS (CDN) + Vanilla CSS | Utility classes + custom grain, glass, masonry |
| **Logic** | Vanilla JavaScript (ES6+) | Class-based SPA with state management |
| **Camera** | WebRTC `getUserMedia` | Live viewfinder stream with facing mode toggle |
| **Image Processing** | Canvas 2D API | Sepia matrix, vignette gradient, noise grain |
| **Audio** | Web Audio API | Oscillator + noise buffer synthesis |
| **Export** | JSZip | Client-side ZIP archive generation |
| **Typography** | Google Fonts | Inter (UI) + JetBrains Mono (metadata) |
| **Icons** | Material Symbols Outlined | Variable-weight icon font |

<br/>

## 🎬 How It Works

### The Film Development Pipeline

Every captured photo passes through a simulated chemical development process:

```
  CAPTURE          PROCESSING         DEVELOPING         DRYING            READY
    📸      ──→      🔴           ──→     🟡          ──→    🟢       ──→    ✅
  (shutter)      (15 seconds)       (countdown)        (final wash)     (viewable)
```

- **Processing** — Raw snapshot is being scanned (red spinner)
- **Developing** — Chemical bath is revealing the image (gold spinner)
- **Drying** — Emulsion is setting on the negative (teal spinner)
- **Ready** — Photo appears in the gallery with a vintage filter applied

### Vintage Filter Stack

```javascript
// 1. Sepia color matrix transform
r = (r * 0.393) + (g * 0.769) + (b * 0.189)

// 2. Channel-specific tone curves
red   × 1.05 + warmth offset
green × 0.95
blue  × 0.85 - cool offset

// 3. Radial vignette gradient
radialGradient(center → edge) = transparent → rgba(12,12,12,0.7)

// 4. Random noise grain particles (3000 dots)
fillRect(random_x, random_y, random_size)
```

<br/>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br/>

## 📝 License

This project is [MIT](LICENSE) licensed.

<br/>

---

<div align="center">

**Built with 📸 and obsessive analog nostalgia.**

*No film was harmed in the making of this app.*

</div>

