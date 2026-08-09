# Portfolio

Minimalist, high-performance personal portfolio built with Next.js 14, Tailwind CSS, and GSAP. Designed with a dark aesthetic, custom vector animations, and smooth interaction feedback.

Live: [https://www.apparely.pro](https://www.apparely.pro)

---

## Features

- **Vector Car Loader:** Custom SVG car loader with spinning wheel spokes and smooth right-to-left drift animation.
- **Interactive Component Design:** Athrix-inspired structural grid framing (`grid-line-h` and corner intersection indicators).
- **Mobile Bottom Nav:** Floating glassmorphic bottom navigation dock for single-thumb mobile navigation.
- **GitHub Activity Heatmap:** Real-time contribution graph fetched dynamically via API for `@Soumyabrataop`.
- **Project Showcase:** Filterable project directory supporting multi-category tagging (Active, Under Development, Deprecated, Starred).
- **Pluckable Footer String:** Interactive GSAP-animated string component with audio haptic feedback on hover/pluck.
- **Performance Optimized:** Cleaned dependencies, static pre-rendering, and dark mobile theme status-bar integration (`#0a0a0a`).

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Library:** [React 18](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [GSAP](https://gsap.com/) & [@gsap/react](https://gsap.com/resources/React/)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
- **Fonts:** [Geist](https://vercel.com/font) & Instrument Serif

---

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Soumyabrataop/portfolio.git

# Navigate into directory
cd portfolio

# Install dependencies
npm install

# Run development server
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build & Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## License

MIT © [Soumyabrata Mukherjee](https://github.com/Soumyabrataop)
