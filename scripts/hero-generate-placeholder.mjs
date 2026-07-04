#!/usr/bin/env node
/**
 * Genera agigov-dream.webm + .mp4 desde poster.svg (placeholder sin After Effects).
 * Requiere: npm install --no-save @resvg/resvg-js ffmpeg-static
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const heroDir = join(root, 'public/hero');
const posterSvg = join(heroDir, 'poster.svg');
const tmpPng = join(heroDir, '.poster-frame.png');

mkdirSync(heroDir, { recursive: true });

const { Resvg } = await import('@resvg/resvg-js');
const ffmpegPath = (await import('ffmpeg-static')).default;

const svg = readFileSync(posterSvg);
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1920 } });
const png = resvg.render().asPng();
writeFileSync(tmpPng, png);

const duration = 20;
const fps = 24;
const frames = duration * fps;
const webm = join(heroDir, 'agigov-dream.webm');
const mp4 = join(heroDir, 'agigov-dream.mp4');

// Zoom suave ida y vuelta — loop sin salto brusco al reiniciar.
const zoompan = [
  `zoompan=z='1+0.06*sin(2*PI*on/${frames})'`,
  `x='iw/2-(iw/zoom/2)'`,
  `y='ih/2-(ih/zoom/2)+20*sin(2*PI*on/${frames})'`,
  `d=${frames}`,
  's=1280x720',
  `fps=${fps}`,
].join(':');

console.log('→ WebM VP9 (placeholder hero)');
execFileSync(ffmpegPath, [
  '-y',
  '-loop',
  '1',
  '-i',
  tmpPng,
  '-vf',
  zoompan,
  '-t',
  String(duration),
  '-an',
  '-c:v',
  'libvpx-vp9',
  '-crf',
  '36',
  '-b:v',
  '0',
  webm,
], { stdio: 'inherit' });

console.log('→ MP4 H.264 (Safari fallback)');
execFileSync(ffmpegPath, [
  '-y',
  '-loop',
  '1',
  '-i',
  tmpPng,
  '-vf',
  zoompan,
  '-t',
  String(duration),
  '-an',
  '-c:v',
  'libx264',
  '-crf',
  '28',
  '-preset',
  'fast',
  '-movflags',
  '+faststart',
  '-pix_fmt',
  'yuv420p',
  mp4,
], { stdio: 'inherit' });

console.log('\nListo:', webm, mp4);
console.log('Activa HERO_FILM.videoAvailable = true en heroFilmConfig.ts');
