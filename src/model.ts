export const TRIGGERS = [
  { id: 'head-bob', label: 'Head bob or camera sway' },
  { id: 'camera-shake', label: 'Camera shake or recoil' },
  { id: 'motion-blur', label: 'Motion blur' },
  { id: 'narrow-fov', label: 'Narrow field of view' },
  { id: 'rapid-turning', label: 'Rapid turning or acceleration' },
  { id: 'ui-motion', label: 'Moving menus or UI effects' },
  { id: 'low-framerate', label: 'Uneven or low frame rate' },
] as const;

export const DEFAULT_SETTINGS = [
  { id: 'head-bob', label: 'Turn head bob or camera sway off', tip: 'May be called view bob, camera movement, or walk animation.' },
  { id: 'camera-shake', label: 'Turn camera shake off', tip: 'Check gameplay and accessibility menus for shake or recoil effects.' },
  { id: 'motion-blur', label: 'Turn motion blur off', tip: 'Also look for per-object blur, radial blur, or post-processing.' },
  { id: 'fov', label: 'Widen the field of view a little', tip: 'Increase in small steps. Extremely wide views can feel distorted.' },
  { id: 'ui-motion', label: 'Reduce animated UI and screen effects', tip: 'Look for reduced motion, menu motion, chromatic aberration, and distortion.' },
  { id: 'turning', label: 'Lower turn speed or use snap turning', tip: 'For controller or VR, try slower acceleration or snap increments.' },
  { id: 'framerate', label: 'Use a stable frame-rate setting', tip: 'A consistent rate can be easier to follow than frequent fluctuations.' },
  { id: 'reticle', label: 'Show a fixed reticle or center dot', tip: 'A stable visual reference may help some players orient themselves.' },
] as const;

export type Setting = {
  id: string;
  label: string;
  tip: string;
  enabled: boolean;
  tried: boolean;
};

export type CheckIn = {
  id: string;
  elapsedMinutes: number;
  symptomLevel: number;
  triggersFelt: string[];
  note: string;
  createdAt: string;
};

export type Session = {
  id: string;
  startedAt: string;
  endedAt?: string;
  pausedAt?: string;
  pausedMs: number;
  baselineSymptom: number;
  status: 'active' | 'ended';
  checkIns: CheckIn[];
};

export type ComfortCard = {
  id: string;
  game: string;
  platform: string;
  baselineMinutes: number;
  triggers: string[];
  customTrigger: string;
  settings: Setting[];
  sessions: Session[];
  createdAt: string;
  updatedAt: string;
};

export type SharePayload = {
  kind: 'comfort-card-share';
  version: 1;
  card: Pick<ComfortCard, 'game' | 'platform' | 'triggers' | 'customTrigger' | 'settings'>;
};

export type BackupPayload = {
  kind: 'comfort-card-backup';
  version: 1;
  exportedAt: string;
  cards: ComfortCard[];
};

export const MAX_BASELINE_MINUTES = 600;

const uid = () => crypto.randomUUID();

export function makeCard(input: {
  game: string;
  platform?: string;
  baselineMinutes?: number;
  triggers?: string[];
  customTrigger?: string;
  settings?: Setting[];
}): ComfortCard {
  const now = new Date().toISOString();
  return {
    id: uid(),
    game: input.game.trim(),
    platform: input.platform?.trim() ?? '',
    baselineMinutes: Math.min(MAX_BASELINE_MINUTES, Math.max(0, Math.round(input.baselineMinutes ?? 0))),
    triggers: input.triggers ?? [],
    customTrigger: input.customTrigger?.trim() ?? '',
    settings: input.settings ?? DEFAULT_SETTINGS.map((setting) => ({ ...setting, enabled: true, tried: false })),
    sessions: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function makeSession(baselineSymptom: number): Session {
  return {
    id: uid(),
    startedAt: new Date().toISOString(),
    pausedMs: 0,
    baselineSymptom,
    status: 'active',
    checkIns: [],
  };
}

export function elapsedMs(session: Session, at = Date.now()): number {
  const end = session.endedAt ? Date.parse(session.endedAt) : session.pausedAt ? Date.parse(session.pausedAt) : at;
  return Math.max(0, end - Date.parse(session.startedAt) - session.pausedMs);
}

export function finishedSessionMinutes(session: Session): number {
  return Math.round(elapsedMs(session) / 60000);
}

export function longestSession(card: ComfortCard): number {
  return card.sessions.filter((session) => session.status === 'ended').reduce((longest, session) => Math.max(longest, finishedSessionMinutes(session)), 0);
}

export function buildSharePayload(card: ComfortCard): SharePayload {
  return {
    kind: 'comfort-card-share',
    version: 1,
    card: {
      game: card.game,
      platform: card.platform,
      triggers: [...card.triggers],
      customTrigger: card.customTrigger,
      settings: card.settings.filter((setting) => setting.enabled).map((setting) => ({ ...setting })),
    },
  };
}

export function shareText(card: ComfortCard): string {
  const triggerLabels: string[] = card.triggers.flatMap((id) => {
    const label = TRIGGERS.find((trigger) => trigger.id === id)?.label;
    return label ? [String(label)] : [];
  });
  if (card.customTrigger) triggerLabels.push(card.customTrigger);
  const plan = card.settings.filter((setting) => setting.enabled).map((setting, index) => `${index + 1}. ${setting.label}`).join('\n');
  return `Comfort card for ${card.game}${card.platform ? ` (${card.platform})` : ''}\n\nThings I notice:\n${triggerLabels.length ? triggerLabels.map((label) => `• ${label}`).join('\n') : '• Still learning my triggers'}\n\nSettings to try:\n${plan}\n\nComfort Card is not medical advice. It cannot tell you whether a game is safe or comfortable for you.`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isText(value: unknown, maximum: number, required = false): value is string {
  return typeof value === 'string' && value.length <= maximum && (!required || value.trim().length > 0);
}

function isStringArray(value: unknown, maximumItemLength = 100): value is string[] {
  return Array.isArray(value) && value.every((item) => isText(item, maximumItemLength));
}

function isKnownTriggerArray(value: unknown): value is string[] {
  const known = new Set<string>(TRIGGERS.map((trigger) => trigger.id));
  return isStringArray(value, 40) && value.every((item) => known.has(item)) && new Set(value).size === value.length;
}

function isTimestamp(value: unknown): value is string {
  return isText(value, 40, true) && Number.isFinite(Date.parse(value));
}

function isWholeNumber(value: unknown, minimum: number, maximum = Number.MAX_SAFE_INTEGER): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum && value <= maximum;
}

function validSetting(value: unknown): value is Setting {
  if (!isRecord(value)) return false;
  return isText(value.id, 100, true)
    && isText(value.label, 200, true)
    && isText(value.tip, 500, true)
    && typeof value.enabled === 'boolean'
    && typeof value.tried === 'boolean';
}

function validCheckIn(value: unknown): value is CheckIn {
  if (!isRecord(value)) return false;
  const felt = value.triggersFelt;
  const allowedTriggers = new Set([...TRIGGERS.map((trigger) => trigger.id), 'custom']);
  return isText(value.id, 100, true)
    && isWholeNumber(value.elapsedMinutes, 0)
    && isWholeNumber(value.symptomLevel, 0, 4)
    && isStringArray(felt, 40)
    && felt.every((trigger) => allowedTriggers.has(trigger))
    && new Set(felt).size === felt.length
    && isText(value.note, 500)
    && isTimestamp(value.createdAt);
}

function validSession(value: unknown): value is Session {
  if (!isRecord(value)) return false;
  const status = value.status;
  const endedAt = value.endedAt;
  const pausedAt = value.pausedAt;
  if (!isText(value.id, 100, true) || !isTimestamp(value.startedAt) || !isWholeNumber(value.pausedMs, 0) || !isWholeNumber(value.baselineSymptom, 0, 4) || (status !== 'active' && status !== 'ended') || !Array.isArray(value.checkIns) || !value.checkIns.every(validCheckIn)) return false;
  if (status === 'ended' && !isTimestamp(endedAt)) return false;
  if (status === 'active' && endedAt !== undefined) return false;
  if (pausedAt !== undefined && (!isTimestamp(pausedAt) || status !== 'active')) return false;
  return new Set(value.checkIns.map((checkIn) => checkIn.id)).size === value.checkIns.length;
}

/** Validates persisted cards as well as full-backup records before they reach UI code. */
export function isComfortCard(value: unknown): value is ComfortCard {
  if (!isRecord(value)) return false;
  if (!isText(value.id, 100, true)
    || !isText(value.game, 80, true)
    || !isText(value.platform, 40)
    || !isWholeNumber(value.baselineMinutes, 0, MAX_BASELINE_MINUTES)
    || !isKnownTriggerArray(value.triggers)
    || !isText(value.customTrigger, 100)
    || !Array.isArray(value.settings)
    || !value.settings.every(validSetting)
    || !Array.isArray(value.sessions)
    || !value.sessions.every(validSession)
    || !isTimestamp(value.createdAt)
    || !isTimestamp(value.updatedAt)) return false;
  return new Set(value.settings.map((setting) => setting.id)).size === value.settings.length
    && new Set(value.sessions.map((session) => session.id)).size === value.sessions.length;
}

export function parseImport(value: unknown): { cards: ComfortCard[]; mode: 'backup' | 'share' } {
  if (!value || typeof value !== 'object') throw new Error('That file is not a Comfort Card export.');
  const payload = value as Record<string, unknown>;
  if (payload.version !== 1) throw new Error('This export version is not supported.');

  if (payload.kind === 'comfort-card-share') {
    const card = payload.card;
    if (!isRecord(card) || !isText(card.game, 80, true) || !isText(card.platform, 40) || !isKnownTriggerArray(card.triggers) || !isText(card.customTrigger, 100) || !Array.isArray(card.settings) || !card.settings.every(validSetting)) {
      throw new Error('This shared card is missing required information.');
    }
    return { cards: [makeCard({ game: card.game, platform: card.platform, triggers: card.triggers, customTrigger: card.customTrigger, settings: card.settings })], mode: 'share' };
  }

  if (payload.kind === 'comfort-card-backup' && isTimestamp(payload.exportedAt) && Array.isArray(payload.cards)) {
    if (!payload.cards.every(isComfortCard)) throw new Error('This backup contains an invalid card. Nothing was restored.');
    return { cards: payload.cards, mode: 'backup' };
  }

  throw new Error('That file is not a Comfort Card export.');
}
