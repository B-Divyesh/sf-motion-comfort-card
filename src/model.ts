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
    baselineMinutes: Math.max(0, Math.round(input.baselineMinutes ?? 0)),
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
  return `Comfort card for ${card.game}${card.platform ? ` (${card.platform})` : ''}\n\nThings I notice:\n${triggerLabels.length ? triggerLabels.map((label) => `• ${label}`).join('\n') : '• Still learning my triggers'}\n\nSettings to try:\n${plan}\n\nPersonal experiment only—not a safety guarantee or medical advice.`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validSetting(value: unknown): value is Setting {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Setting>;
  return typeof item.id === 'string' && typeof item.label === 'string' && typeof item.tip === 'string' && typeof item.enabled === 'boolean' && typeof item.tried === 'boolean';
}

export function parseImport(value: unknown): { cards: ComfortCard[]; mode: 'backup' | 'share' } {
  if (!value || typeof value !== 'object') throw new Error('That file is not a Comfort Card export.');
  const payload = value as Record<string, unknown>;
  if (payload.version !== 1) throw new Error('This export version is not supported.');

  if (payload.kind === 'comfort-card-share') {
    const card = payload.card as Partial<ComfortCard> | undefined;
    if (!card || typeof card.game !== 'string' || !card.game.trim() || typeof card.platform !== 'string' || !isStringArray(card.triggers) || typeof card.customTrigger !== 'string' || !Array.isArray(card.settings) || !card.settings.every(validSetting)) {
      throw new Error('This shared card is missing required information.');
    }
    return { cards: [makeCard({ game: card.game, platform: card.platform, triggers: card.triggers, customTrigger: card.customTrigger, settings: card.settings })], mode: 'share' };
  }

  if (payload.kind === 'comfort-card-backup' && Array.isArray(payload.cards)) {
    const cards = payload.cards as Partial<ComfortCard>[];
    const valid = cards.every((card) => typeof card.id === 'string' && typeof card.game === 'string' && card.game.trim() && Array.isArray(card.settings) && card.settings.every(validSetting) && Array.isArray(card.sessions));
    if (!valid) throw new Error('This backup contains an invalid card.');
    return { cards: cards as ComfortCard[], mode: 'backup' };
  }

  throw new Error('That file is not a Comfort Card export.');
}
