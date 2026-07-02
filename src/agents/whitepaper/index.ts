import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface WhitepaperSection {
  id: string;
  title: string;
  principles: string[];
  body: string;
}

const DEFAULT_PATH = join(process.cwd(), 'docs/WHITEPAPER.md');

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Parsea WHITEPAPER.md en secciones indexables. */
export function loadWhitepaper(path = DEFAULT_PATH): WhitepaperSection[] {
  if (!existsSync(path)) {
    throw new Error(`Whitepaper no encontrado: ${path}`);
  }

  const raw = readFileSync(path, 'utf8');
  const sections: WhitepaperSection[] = [];
  const chunks = raw.split(/^## /m).slice(1);

  for (const chunk of chunks) {
    const [titleLine, ...rest] = chunk.split('\n');
    const title = titleLine.trim();
    const body = rest.join('\n').trim();
    const principlesMatch = body.match(
      /\*\*Principios:\*\*\s*([^\n]+)/i,
    );
    const principles = principlesMatch
      ? principlesMatch[1].split(',').map((p) => p.trim().toLowerCase())
      : [];

    sections.push({
      id: slugify(title),
      title,
      principles,
      body,
    });
  }

  return sections;
}

export interface ConformityResult {
  conforme: boolean;
  score: number;
  matchedSections: string[];
  matchedPrinciples: string[];
}

/** Evalúa texto de propuesta contra principios indexados del whitepaper. */
export function assessConformity(
  text: string,
  sections: WhitepaperSection[],
): ConformityResult {
  const normalized = text.toLowerCase();
  const matchedSections: string[] = [];
  const matchedPrinciples = new Set<string>();

  for (const section of sections) {
    const sectionHit =
      section.principles.some((p) => normalized.includes(p)) ||
      normalized.includes(section.id.replace(/-/g, ' '));

    if (sectionHit) {
      matchedSections.push(section.title);
      for (const p of section.principles) {
        if (normalized.includes(p)) matchedPrinciples.add(p);
      }
    }
  }

  const allPrinciples = sections.flatMap((s) => s.principles);
  const score =
    allPrinciples.length === 0
      ? 0
      : matchedPrinciples.size / allPrinciples.length;

  const conforme = matchedSections.length >= 2 && score >= 0.15;

  return {
    conforme,
    score,
    matchedSections,
    matchedPrinciples: [...matchedPrinciples],
  };
}

let cachedSections: WhitepaperSection[] | null = null;

export function getWhitepaperIndex(): WhitepaperSection[] {
  if (!cachedSections) {
    cachedSections = loadWhitepaper();
  }
  return cachedSections;
}

export function resetWhitepaperCache(): void {
  cachedSections = null;
}
