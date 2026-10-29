# Portfolio — React + Three.js + GSAP

- **React** + Vite
- **Tailwind CSS**
- **Three.js** + React Three Fiber + Drei
- **GSAP** (ScrollTrigger)
- **Lucide React** icons
- **Google Fonts** (Inter, JetBrains Mono, Space Grotesk)
- **Spotify Embed** widget
- **React Bits Lanyard** interactive 3D component (Three.js)
- Siap deploy ke **Vercel**

Komponen lanyard menggunakan lisensi MIT + Commons Clause. Lihat
[THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md) untuk atribusi dan ketentuan
penggunaannya. Artwork depan dan belakang kartu di `public/lanyard-front.jpeg`
dan `public/lanyard-back.jpeg` disediakan untuk portfolio ini.

## Cara Menjalankan

```bash
cd portfolio
npm install
npm run dev
```

Buka http://localhost:5173

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Framework preset: Vite
4. Deploy

## Fitur

- Background 3D interaktif (icosahedron, torus, octahedron)
- Animasi GSAP pada hero & scroll
- Navbar glassmorphism
- Spotify playlist embed
- Form kontak
- Responsive & dark theme
