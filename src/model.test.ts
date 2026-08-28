import { describe, expect, it, vi } from 'vitest';
import { buildSharePayload, elapsedMs, makeCard, parseImport, shareText } from './model';

describe('comfort card data', () => {
  it('keeps session history out of a shared card', () => {
    const card = makeCard({ game: 'Example Game' });
    card.sessions.push({ id: 'private', startedAt: new Date().toISOString(), pausedMs: 0, baselineSymptom: 2, status: 'active', checkIns: [] });
    const payload = buildSharePayload(card);
    expect(payload.card).not.toHaveProperty('sessions');
    expect(JSON.stringify(payload)).not.toContain('private');
  });

  it('creates readable non-medical share text', () => {
    const card = makeCard({ game: 'Example Game', triggers: ['motion-blur'] });
    expect(shareText(card)).toContain('Motion blur');
    expect(shareText(card)).toContain('not a safety guarantee');
  });

  it('calculates elapsed time without paused time', () => {
    const now = new Date('2026-08-28T10:30:00Z');
    vi.setSystemTime(now);
    expect(elapsedMs({ id: 's', startedAt: '2026-08-28T10:00:00Z', pausedMs: 5 * 60_000, baselineSymptom: 0, status: 'active', checkIns: [] })).toBe(25 * 60_000);
    vi.useRealTimers();
  });

  it('rejects malformed imports and accepts shared cards', () => {
    expect(() => parseImport({ kind: 'unknown', version: 1 })).toThrow('not a Comfort Card');
    const original = makeCard({ game: 'Example Game' });
    const parsed = parseImport(buildSharePayload(original));
    expect(parsed.mode).toBe('share');
    expect(parsed.cards[0].game).toBe('Example Game');
    expect(parsed.cards[0].sessions).toEqual([]);
  });
});
