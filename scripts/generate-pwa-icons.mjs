// Regenerate PWA icons từ public/nedu.jpg.
//
// Chạy: pnpm pwa:icons (hoặc node scripts/generate-pwa-icons.mjs)
// Rerun khi đổi brand logo source.
//
// Output:
// - public/icons/icon-192.png       (Android home screen)
// - public/icons/icon-512.png       (Android splash + high-density)
// - public/icons/icon-maskable-512.png  (Android adaptive — 80% safe zone padded)
// - public/icons/apple-touch-icon.png   (iOS, 180×180)

import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const src = path.join(root, 'public/nedu.jpg')
const outDir = path.join(root, 'public/icons')

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of targets) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: WHITE })
    .png()
    .toFile(path.join(outDir, name))
  console.log(`✓ ${name} (${size}×${size})`)
}

// Maskable: content phải nằm trong inner 80% safe zone — Android mask có thể
// crop sát edge. Resize content xuống 80% rồi pad trắng ra full 512×512.
const maskSize = 512
const safe = Math.round(maskSize * 0.8) // 410
const pad = Math.round((maskSize - safe) / 2)

await sharp(src)
  .resize(safe, safe, { fit: 'contain', background: WHITE })
  .extend({ top: pad, bottom: pad, left: pad, right: pad, background: WHITE })
  .png()
  .toFile(path.join(outDir, 'icon-maskable-512.png'))
console.log(`✓ icon-maskable-512.png (${maskSize}×${maskSize}, content in ${safe}×${safe})`)
