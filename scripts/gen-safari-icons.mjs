// Generates Safari-safe icons: a chibi pixel cat on a transparent background.
// Original art — no Nyan Cat sprite — so it satisfies App Store guideline 4.1(c).
//
// Run: `node scripts/gen-safari-icons.mjs`
// Output: assets-safari/icon{16,48,128}.png

import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const TRANSPARENT = [0, 0, 0, 0];
const CAT_BODY = [0xff, 0xff, 0xff, 0xff];
const OUTLINE = [0x2a, 0x1f, 0x35, 0xff];
const CHEEK = [0xff, 0xb6, 0xc1, 0xff];

function dist(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function triSign(px, py, ax, ay, bx, by) {
  return (px - bx) * (ay - by) - (ax - bx) * (py - by);
}

function inTri(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = triSign(px, py, ax, ay, bx, by);
  const d2 = triSign(px, py, bx, by, cx, cy);
  const d3 = triSign(px, py, cx, cy, ax, ay);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

// Returns [r, g, b, a] for a single sample at normalized (u, v) in [0, 1).
function sample(u, v) {
  const headR = 0.3;
  const headOutR = 0.345;
  const dHead = dist(u, v, 0.5, 0.56);

  const leftEar = inTri(u, v, 0.24, 0.5, 0.32, 0.15, 0.46, 0.38);
  const rightEar = inTri(u, v, 0.76, 0.5, 0.68, 0.15, 0.54, 0.38);
  const leftEarOut = inTri(u, v, 0.21, 0.52, 0.32, 0.11, 0.48, 0.4);
  const rightEarOut = inTri(u, v, 0.79, 0.52, 0.68, 0.11, 0.52, 0.4);

  const inBody = dHead <= headR || leftEar || rightEar;
  const inBodyOut = dHead <= headOutR || leftEarOut || rightEarOut;

  if (!inBodyOut) return TRANSPARENT;

  if (!inBody) return OUTLINE;

  const eyeY = v >= 0.5 && v <= 0.535;
  const leftEyeX = u >= 0.36 && u <= 0.45;
  const rightEyeX = u >= 0.55 && u <= 0.64;
  if (eyeY && (leftEyeX || rightEyeX)) return OUTLINE;

  if (dist(u, v, 0.34, 0.63) <= 0.045 || dist(u, v, 0.66, 0.63) <= 0.045) return CHEEK;

  if (v >= 0.58 && v <= 0.605 && u >= 0.485 && u <= 0.515) return OUTLINE;

  return CAT_BODY;
}

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const rows = [];
  for (let y = 0; y < size; y++) {
    const v = (y + 0.5) / size;
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0;

    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size;
      const [r, g, b, a] = sample(u, v);
      const o = 1 + x * 4;
      row[o] = r;
      row[o + 1] = g;
      row[o + 2] = b;
      row[o + 3] = a;
    }
    rows.push(row);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('assets-safari', { recursive: true });
for (const size of [16, 48, 128]) {
  const path = `assets-safari/icon${size}.png`;
  writeFileSync(path, makePng(size));
  console.log(`${path} (${size}x${size})`);
}
