const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'public', 'state-logos', 'MoJ_logo.jpeg');
const outPath = path.join(__dirname, '..', 'public', 'favicon.ico');

const buf = fs.readFileSync(srcPath);

function getJpegSize(b) {
  for (let i = 0; i < b.length - 9; i++) {
    if (b[i] === 0xff) {
      const marker = b[i + 1];
      const sofMarkers = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf];
      if (sofMarkers.includes(marker)) {
        const height = (b[i + 5] << 8) | b[i + 6];
        const width = (b[i + 7] << 8) | b[i + 8];
        return { width, height };
      }
    }
  }
  return null;
}

const dims = getJpegSize(buf);
const width = dims?.width ?? 0;
const height = dims?.height ?? 0;
const widthByte = width === 256 ? 0 : Math.min(255, Math.max(1, width));
const heightByte = height === 256 ? 0 : Math.min(255, Math.max(1, height));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const dir = Buffer.alloc(16);
dir.writeUInt8(widthByte, 0);
dir.writeUInt8(heightByte, 1);
dir.writeUInt8(0, 2);
dir.writeUInt8(0, 3);
dir.writeUInt16LE(1, 4);
dir.writeUInt16LE(0, 6);
dir.writeUInt32LE(buf.length, 8);
dir.writeUInt32LE(6 + 16, 12);

const ico = Buffer.concat([header, dir, buf]);
fs.writeFileSync(outPath, ico);

console.log('Created', outPath);
console.log('JPEG dims:', dims);
console.log('ICO bytes:', ico.length);
