import './styles.css';
import { getCards, importCards, makeBackup, removeCard, saveCard } from './db';
import {
  DEFAULT_SETTINGS,
  TRIGGERS,
  buildSharePayload,
  elapsedMs,
  finishedSessionMinutes,
  longestSession,
  makeCard,
  makeSession,
  parseImport,
  shareText,
  type ComfortCard,
  type Session,
  type Setting,
} from './model';

type Draft = {
  game: string;
  platform: string;
  baselineMinutes: number;
  triggers: string[];
  customTrigger: string;
  settings: Setting[];
};

const appElement = document.querySelector<HTMLDivElement>('#app');
if (!appElement) throw new Error('App root is missing.');
const app: HTMLDivElement = appElement;

let cards: ComfortCard[] = [];
let storageError = '';
let draft: Draft | null = null;
let formError = '';
let toastTimer = 0;
let timerInterval = 0;
let afterCheckIn = false;
let deferredInstall: Event | null = null;

const escapeHtml = (value: string | number) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const icon = (name: 'plus' | 'arrow' | 'pause' | 'play' | 'stop' | 'share' | 'download' | 'upload' | 'trash' | 'check') => {
  const paths = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="m5 12 5 5L20 7"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>',
    stop: '<path d="M7 7h10v10H7z"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    download: '<path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"/>',
    upload: '<path d="M12 16V5m0 0 4 4m-4-4L8 9M5 20h14"/>',
    trash: '<path d="M5 7h14M9 7V4h6v3m2 0-1 13H8L7 7m4 4v5m3-5v5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
  };
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
};

function shell(content: string): string {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/" aria-label="Comfort Card home"><span class="brand-mark" aria-hidden="true">CC</span><span>Comfort Card</span></a>
        <nav aria-label="Primary">
          <a href="/#new">New card</a>
          <button class="text-button" type="button" data-action="backup">Back up</button>
          <button class="text-button" type="button" data-action="open-import">Import</button>
        </nav>
      </div>
      <div class="offline-banner" data-offline-banner role="status" ${navigator.onLine ? 'hidden' : ''}>Offline mode · your saved cards still work</div>
    </header>
    <main id="main-content" tabindex="-1">${content}</main>
    <footer class="site-footer">
      <div><span class="footer-stamp">Local by design</span><p>Your cards stay in this browser unless you export them.</p></div>
      <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
      <p class="image-note">Original AI-generated risograph artwork · no trackers or ads.</p>
    </footer>
    <input id="import-file" class="visually-hidden" type="file" accept="application/json,.json" aria-label="Choose a Comfort Card export" />
    <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
    <div id="update-toast" class="update-toast" role="status" hidden><span>A fresh version is ready.</span><button type="button" data-action="reload-app">Update now</button></div>
  `;
}

function homeView(): string {
  const list = cards.length
    ? `<section class="library" aria-labelledby="library-title">
        <div class="section-heading"><div><p class="eyebrow">On this device</p><h2 id="library-title">Your game cards</h2></div><span class="count-stamp">${cards.length} ${cards.length === 1 ? 'card' : 'cards'}</span></div>
        <div class="card-grid">${cards.map(cardSlip).join('')}</div>
      </section>`
    : `<section class="empty-state" aria-labelledby="empty-title">
        <div class="empty-symbol" aria-hidden="true"><span></span><span></span><span></span></div>
        <div><p class="eyebrow">Your drawer is empty</p><h2 id="empty-title">Start with the game you want to try.</h2><p>Make a short settings plan now, so you do not have to hunt through menus once play begins.</p><a class="button button-primary" href="#new">${icon('plus')} Make your first card</a></div>
      </section>`;

  return shell(`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">A before-you-play field note</p>
        <h1>Find a steadier way into the game.</h1>
        <p class="hero-lede">Build a personal list of visual settings to try, then use gentle 15-minute check-ins to notice how the session is going.</p>
        <div class="hero-actions"><a class="button button-primary" href="#new">${icon('plus')} Make a comfort card</a><a class="quiet-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a></div>
        <p class="care-note"><strong>Your comfort is the stop signal.</strong> This is a personal planning tool, not medical advice or a promise that a game will feel safe.</p>
      </div>
      <figure class="hero-art"><picture><source type="image/webp" srcset="/assets/comfort-card-hero-720.webp 720w, /assets/comfort-card-hero-1200.webp 1200w" sizes="(max-width: 760px) 100vw, 46vw"><img src="/assets/comfort-card-hero-1200.webp" width="1200" height="800" fetchpriority="high" alt="Risograph collage of a game controller, a large pause button, and a calm horizon." /></picture><figcaption>Pause belongs in the plan.</figcaption></figure>
    </section>
    ${storageError ? `<section class="error-state" role="alert"><p class="eyebrow">Local storage problem</p><h2>Your cards could not be opened.</h2><p>${escapeHtml(storageError)}</p><button class="button" data-action="retry-storage">Try again</button></section>` : list}
    <section class="how" id="how-it-works" aria-labelledby="how-title">
      <p class="eyebrow">Three small moves</p><h2 id="how-title">Plan, notice, keep what helped.</h2>
      <ol class="steps"><li><span>01</span><div><h3>Name the motion</h3><p>Mark the visual patterns you already know, without needing to diagnose anything.</p></div></li><li><span>02</span><div><h3>Order your settings</h3><p>Put the most promising game options first and check them off as you try them.</p></div></li><li><span>03</span><div><h3>Check in, or stop</h3><p>Notice symptoms every 15 minutes. Pause or stop at any time—no streaks, pressure, or scoring.</p></div></li></ol>
    </section>
  `);
}

function cardSlip(card: ComfortCard): string {
  const latest = card.sessions[0];
  const longest = longestSession(card);
  const triggerCount = card.triggers.length + (card.customTrigger ? 1 : 0);
  return `<article class="game-slip">
    <div class="slip-top"><span class="slip-platform">${escapeHtml(card.platform || 'Platform not set')}</span><span aria-label="${card.sessions.length} sessions">${String(card.sessions.length).padStart(2, '0')}</span></div>
    <h3><a href="#card/${encodeURIComponent(card.id)}">${escapeHtml(card.game)}</a></h3>
    <p>${triggerCount ? `${triggerCount} motion ${triggerCount === 1 ? 'trigger' : 'triggers'} noted` : 'Triggers still to be learned'}</p>
    <div class="slip-stats"><span><strong>${longest}</strong> longest min</span><span><strong>${card.settings.filter((setting) => setting.tried).length}/${card.settings.filter((setting) => setting.enabled).length}</strong> settings tried</span></div>
    ${latest?.status === 'active' ? `<a class="resume-link" href="#session/${encodeURIComponent(card.id)}/${encodeURIComponent(latest.id)}">${icon('play')} Resume active session</a>` : `<a class="slip-link" href="#card/${encodeURIComponent(card.id)}">Open card <span aria-hidden="true">→</span></a>`}
  </article>`;
}

function defaultDraft(): Draft {
  return {
    game: '', platform: '', baselineMinutes: 0, triggers: [], customTrigger: '',
    settings: DEFAULT_SETTINGS.map((setting) => ({ ...setting, enabled: true, tried: false })),
  };
}

function createView(): string {
  if (!draft) draft = defaultDraft();
  const formDraft = draft;
  return shell(`<section class="page-intro narrow"><a class="back-link" href="/#library-title">← Your cards</a><p class="eyebrow">New field note</p><h1>Make a comfort card.</h1><p>Start with what you know. You can change every part later.</p></section>
    <form id="create-card" class="composer" novalidate>
      <section class="form-section" aria-labelledby="game-heading"><div class="step-no">01</div><div><h2 id="game-heading">Which game?</h2><p class="section-note">Only the game name is required.</p>
        <div class="field-row"><label class="field"><span>Game name <em>Required</em></span><input name="game" required maxlength="80" autocomplete="off" value="${escapeHtml(formDraft.game)}" aria-describedby="game-error" /><small id="game-error" class="field-error">${formError}</small></label><label class="field"><span>Platform <small>Optional</small></span><input name="platform" maxlength="40" autocomplete="off" value="${escapeHtml(formDraft.platform)}" placeholder="PC, PlayStation, Switch…" /></label></div>
        <label class="field compact"><span>Usual comfortable play time <small>Optional</small></span><span class="number-field"><input name="baselineMinutes" type="number" min="0" max="600" inputmode="numeric" value="${formDraft.baselineMinutes || ''}" /><span>minutes</span></span><small>Use 0 if you do not have a baseline yet.</small></label>
      </div></section>
      <section class="form-section" aria-labelledby="trigger-heading"><div class="step-no">02</div><div><h2 id="trigger-heading">What motion do you notice?</h2><p class="section-note">Choose any familiar patterns. It is fine to leave this blank.</p>
        <fieldset class="choice-grid"><legend class="visually-hidden">Motion triggers</legend>${TRIGGERS.map((trigger) => `<label class="choice-tile"><input type="checkbox" name="triggers" value="${trigger.id}" ${formDraft.triggers.includes(trigger.id) ? 'checked' : ''}/><span class="choice-box">${icon('check')}</span><span>${trigger.label}</span></label>`).join('')}</fieldset>
        <label class="field"><span>Something else <small>Optional</small></span><input name="customTrigger" maxlength="100" value="${escapeHtml(formDraft.customTrigger)}" placeholder="For example, fish-eye effects" /></label>
      </div></section>
      <section class="form-section" aria-labelledby="plan-heading"><div class="step-no">03</div><div><h2 id="plan-heading">Put your settings plan in order.</h2><p class="section-note">Uncheck anything that does not apply. Use the arrows to move the most promising changes up.</p>
        <ol class="setting-builder">${formDraft.settings.map((setting, index) => `<li><label><input type="checkbox" name="setting-${escapeHtml(setting.id)}" ${setting.enabled ? 'checked' : ''}/><span class="choice-box">${icon('check')}</span><span><strong>${escapeHtml(setting.label)}</strong><small>${escapeHtml(setting.tip)}</small></span></label><span class="move-buttons"><button type="button" data-action="move-setting" data-index="${index}" data-direction="-1" aria-label="Move ${escapeHtml(setting.label)} up" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-action="move-setting" data-index="${index}" data-direction="1" aria-label="Move ${escapeHtml(setting.label)} down" ${index === formDraft.settings.length - 1 ? 'disabled' : ''}>↓</button></span></li>`).join('')}</ol>
      </div></section>
      <div class="composer-submit"><p><strong>Saved only on this device.</strong><br />No account, upload, or hidden tracking.</p><button class="button button-primary" type="submit">Make this card ${icon('arrow')}</button></div>
    </form>`);
}

function findCard(id: string): ComfortCard | undefined {
  return cards.find((card) => card.id === id);
}

function activeSession(card: ComfortCard): Session | undefined {
  return card.sessions.find((session) => session.status === 'active');
}

function cardView(card: ComfortCard): string {
  const active = activeSession(card);
  const triggerLabels = card.triggers.map((id) => TRIGGERS.find((trigger) => trigger.id === id)?.label).filter(Boolean) as string[];
  if (card.customTrigger) triggerLabels.push(card.customTrigger);
  const longest = longestSession(card);
  const improvement = longest - card.baselineMinutes;
  return shell(`<section class="card-header"><div><a class="back-link" href="/">← Your cards</a><p class="eyebrow">Personal comfort card</p><h1>${escapeHtml(card.game)}</h1><p>${escapeHtml(card.platform || 'Platform not set')} · Updated ${new Date(card.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p></div><div class="card-actions"><button class="button" type="button" data-action="share" data-card="${card.id}">${icon('share')} Share clean copy</button><button class="icon-button danger-quiet" type="button" data-action="confirm-delete" data-card="${card.id}">${icon('trash')}<span>Delete</span></button></div></section>
    <div class="card-layout">
      <section class="paper-plan" aria-labelledby="plan-title"><div class="paper-pin" aria-hidden="true"></div><p class="eyebrow">Try in this order</p><h2 id="plan-title">Settings plan</h2><p class="section-note">Check an item after you have tried it in this game.</p>
        <ol class="try-list">${card.settings.filter((setting) => setting.enabled).map((setting) => `<li class="${setting.tried ? 'is-tried' : ''}"><label><input type="checkbox" data-action="toggle-tried" data-card="${card.id}" data-setting="${escapeHtml(setting.id)}" ${setting.tried ? 'checked' : ''}/><span class="try-check">${icon('check')}</span><span><strong>${escapeHtml(setting.label)}</strong><small>${escapeHtml(setting.tip)}</small></span></label></li>`).join('')}</ol>
      </section>
      <aside class="card-aside"><section><p class="eyebrow">Things I notice</p><h2>Motion notes</h2>${triggerLabels.length ? `<ul class="trigger-list">${triggerLabels.map((label) => `<li>${escapeHtml(label)}</li>`).join('')}</ul>` : '<p class="muted">Nothing listed yet. You can still use the settings plan as a starting point.</p>'}</section>
        <section class="baseline-block"><p class="eyebrow">Your reference</p><h2>${card.baselineMinutes || '—'} <small>baseline minutes</small></h2><p>${longest ? `Longest recorded session: <strong>${longest} min</strong>${card.baselineMinutes ? ` (${improvement >= 0 ? '+' : ''}${improvement} from baseline)` : ''}.` : 'Finish a session to create a comparison.'}</p></section>
      </aside>
    </div>
    <section class="session-launch" aria-labelledby="session-title"><div><p class="eyebrow">When you are ready</p><h2 id="session-title">Start with a quick symptom check.</h2><p>The first reminder is in 15 minutes. You can check in or stop sooner.</p></div>${active ? `<a class="button button-primary" href="#session/${encodeURIComponent(card.id)}/${encodeURIComponent(active.id)}">${icon('play')} Resume session</a>` : `<button class="button button-primary" type="button" data-action="open-start" data-card="${card.id}">${icon('play')} Start a session</button>`}</section>
    ${sessionsView(card)}
    ${startDialog(card)}${shareDialog(card)}${deleteDialog(card)}`);
}

function sessionsView(card: ComfortCard): string {
  const ended = card.sessions.filter((session) => session.status === 'ended');
  return `<section class="history" aria-labelledby="history-title"><div class="section-heading"><div><p class="eyebrow">Private session history</p><h2 id="history-title">What you recorded</h2></div><span class="count-stamp">${ended.length} finished</span></div>${ended.length ? `<div class="history-table" role="table" aria-label="Finished sessions"><div class="history-row history-head" role="row"><span role="columnheader">Date</span><span role="columnheader">Time</span><span role="columnheader">Check-ins</span><span role="columnheader">Last symptom</span></div>${ended.map((session) => { const last = session.checkIns.at(-1); return `<div class="history-row" role="row"><span role="cell">${new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><span role="cell">${finishedSessionMinutes(session)} min</span><span role="cell">${session.checkIns.length}</span><span role="cell">${last ? `${last.symptomLevel} / 4` : 'Not recorded'}</span></div>`; }).join('')}</div>` : '<div class="inline-empty"><span aria-hidden="true">◎</span><p>Finished sessions will appear here. Notes never appear in the shared copy.</p></div>'}</section>`;
}

function symptomChoices(name: string, selected?: number): string {
  const labels = ['None', 'Slight', 'Noticeable', 'Strong', 'Stop now'];
  return `<fieldset class="symptom-scale"><legend>How are your symptoms right now?</legend><div>${labels.map((label, value) => `<label><input type="radio" name="${name}" value="${value}" ${selected === value ? 'checked' : ''} required/><span><strong>${value}</strong><small>${label}</small></span></label>`).join('')}</div><p class="scale-hint">0 = none · 4 = stop now. There is no target score.</p></fieldset>`;
}

function startDialog(card: ComfortCard): string {
  return `<dialog id="start-dialog" class="modal"><form id="start-session" data-card="${card.id}"><button class="modal-close" type="button" data-action="close-dialog" aria-label="Close">×</button><p class="eyebrow">Before you begin</p><h2>Make a starting note.</h2><p>This makes later check-ins easier to compare. It does not judge whether you should play.</p>${symptomChoices('baselineSymptom')}<div class="dialog-actions"><button class="button button-primary" type="submit">${icon('play')} Start 15-minute check</button><button class="button button-quiet" type="button" data-action="close-dialog">Not now</button></div></form></dialog>`;
}

function shareDialog(card: ComfortCard): string {
  return `<dialog id="share-dialog" class="modal share-modal"><div><button class="modal-close" type="button" data-action="close-dialog" aria-label="Close">×</button><p class="eyebrow">Share without history</p><h2>A clean copy of your plan.</h2><p>This leaves out session times, symptom check-ins, and private notes. Review before sharing.</p><label class="field"><span>Share text</span><textarea id="share-text" rows="12" readonly>${escapeHtml(shareText(card))}</textarea></label><div class="dialog-actions"><button class="button button-primary" type="button" data-action="copy-share" data-card="${card.id}">${icon('share')} Copy text</button><button class="button" type="button" data-action="download-share" data-card="${card.id}">${icon('download')} Download card</button></div></div></dialog>`;
}

function deleteDialog(card: ComfortCard): string {
  return `<dialog id="delete-dialog" class="modal"><div><button class="modal-close" type="button" data-action="close-dialog" aria-label="Close">×</button><p class="eyebrow danger-text">Delete local card</p><h2>Delete ${escapeHtml(card.game)}?</h2><p>This removes its settings and all session history from this browser. Export a backup first if you may want it later.</p><div class="dialog-actions"><button class="button button-danger" type="button" data-action="delete-card" data-card="${card.id}">${icon('trash')} Delete permanently</button><button class="button" type="button" data-action="close-dialog">Keep card</button></div></div></dialog>`;
}

function sessionView(card: ComfortCard, session: Session): string {
  if (session.status === 'ended') return endedSessionView(card, session);
  const elapsed = elapsedMs(session);
  const nextAt = (session.checkIns.length + 1) * 15 * 60_000;
  const remaining = Math.max(0, nextAt - elapsed);
  const paused = Boolean(session.pausedAt);
  const latest = session.checkIns.at(-1);
  const checkInPanel = afterCheckIn && latest ? decisionPanel(card, session, latest.symptomLevel) : '';
  return shell(`<section class="session-page">
    <div class="session-top"><a class="back-link" href="#card/${encodeURIComponent(card.id)}">← ${escapeHtml(card.game)} card</a><span class="live-stamp">${paused ? 'Paused' : 'Session active'}</span></div>
    <div class="timer-block"><p class="eyebrow">${remaining ? 'Next gentle check-in' : 'Check-in ready'}</p><h1><span id="session-timer" data-session-timer data-started="${session.startedAt}">${formatTimer(remaining)}</span></h1><p>${remaining ? 'You do not have to wait. Check in whenever you need.' : 'Take a moment to notice how you feel.'}</p><div class="timer-actions"><button class="button" type="button" data-action="toggle-pause" data-card="${card.id}" data-session="${session.id}">${paused ? icon('play') + ' Resume timer' : icon('pause') + ' Pause timer'}</button><button class="button button-danger" type="button" data-action="stop-now">${icon('stop')} Stop now</button></div></div>
    ${checkInPanel || `<section class="checkin-callout"><div><p class="eyebrow">Starting symptom: ${session.baselineSymptom} / 4</p><h2>${remaining ? 'Notice a change?' : 'Ready for a check-in?'}</h2><p>Record what you notice now. A higher number is useful information, not a failed session.</p></div><a class="button button-primary" href="#checkin/${encodeURIComponent(card.id)}/${encodeURIComponent(session.id)}">Check in now ${icon('arrow')}</a></section>`}
    <section class="session-settings" aria-labelledby="session-settings-title"><p class="eyebrow">Keep the plan nearby</p><h2 id="session-settings-title">Settings in this session</h2><ul>${card.settings.filter((setting) => setting.enabled).map((setting) => `<li class="${setting.tried ? 'is-tried' : ''}">${setting.tried ? icon('check') : '<span aria-hidden="true">○</span>'}<span>${escapeHtml(setting.label)}</span></li>`).join('')}</ul></section>
    <p class="session-privacy">Session notes are saved automatically on this device and omitted from shared cards.</p>
    ${stopDialog(card, session)}
  </section>`);
}

function decisionPanel(card: ComfortCard, session: Session, symptom: number): string {
  const increased = symptom > session.baselineSymptom;
  return `<section class="decision-panel ${increased ? 'decision-caution' : ''}" tabindex="-1" id="decision-panel"><p class="eyebrow">Check-in saved · ${symptom} / 4</p><h2>${increased ? 'Your symptoms increased.' : 'Choose what feels right next.'}</h2><p>${increased ? 'Consider ending here or taking a longer break. Your note is already safe.' : 'Continue for another 15 minutes, adjust a setting, or finish here.'}</p><div class="decision-actions">${increased ? `<button class="button button-danger" type="button" data-action="stop-now">${icon('stop')} Stop this session</button>` : `<button class="button button-primary" type="button" data-action="continue-session">${icon('play')} Continue 15 minutes</button>`}<a class="button" href="#card/${encodeURIComponent(card.id)}">Adjust settings</a><button class="button button-quiet" type="button" data-action="end-session" data-card="${card.id}" data-session="${session.id}">End and save</button></div></section>`;
}

function checkInView(card: ComfortCard, session: Session): string {
  return shell(`<section class="page-intro narrow"><a class="back-link" href="#session/${encodeURIComponent(card.id)}/${encodeURIComponent(session.id)}">← Back to timer</a><p class="eyebrow">${Math.max(1, Math.round(elapsedMs(session) / 60000))}-minute note</p><h1>What do you notice?</h1><p>Take your eyes off the game while you check in. Your answers stay on this device.</p></section>
    <form id="check-in" class="checkin-form" data-card="${card.id}" data-session="${session.id}">${symptomChoices('symptomLevel')}
      <fieldset class="felt-list"><legend>Did any familiar motion stand out? <small>Optional</small></legend>${[...card.triggers.map((id) => ({ id, label: TRIGGERS.find((trigger) => trigger.id === id)?.label ?? id })), ...(card.customTrigger ? [{ id: 'custom', label: card.customTrigger }] : [])].map((trigger) => `<label class="choice-tile"><input type="checkbox" name="triggersFelt" value="${escapeHtml(trigger.id)}"/><span class="choice-box">${icon('check')}</span><span>${escapeHtml(trigger.label)}</span></label>`).join('') || '<p class="muted">No triggers are listed on this card yet.</p>'}</fieldset>
      <label class="field"><span>Private note <small>Optional</small></span><textarea name="note" maxlength="500" rows="4" placeholder="What changed? Which setting were you testing?"></textarea><small>Never included in the clean shared card.</small></label>
      <div class="composer-submit"><p>If you feel unwell, stop first. You can save this note later.</p><button class="button button-primary" type="submit">Save check-in ${icon('arrow')}</button></div>
    </form>`);
}

function stopDialog(card: ComfortCard, session: Session): string {
  return `<dialog id="stop-dialog" class="modal stop-modal"><div><span class="stop-mark" aria-hidden="true">Ⅱ</span><p class="eyebrow danger-text">Pause is part of the plan</p><h2>Step away from the motion.</h2><p>Look at a stable point or close your eyes. Give yourself time. If symptoms are severe, unusual, or do not settle, consider seeking medical advice.</p><div class="dialog-actions"><button class="button button-danger" type="button" data-action="end-session" data-card="${card.id}" data-session="${session.id}">${icon('stop')} End and save session</button><button class="button" type="button" data-action="close-dialog">Return only if comfortable</button></div></div></dialog>`;
}

function endedSessionView(card: ComfortCard, session: Session): string {
  const minutes = finishedSessionMinutes(session);
  const last = session.checkIns.at(-1);
  return shell(`<section class="end-sheet"><p class="eyebrow">Session saved locally</p><div class="end-mark">${icon('check')}</div><h1>You stopped at ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.</h1><p>${last ? `Your last check-in was ${last.symptomLevel} / 4.` : 'No symptom check-in was recorded.'} Stopping is always a valid result.</p><div class="end-stats"><span><strong>${session.checkIns.length}</strong> check-ins</span><span><strong>${card.baselineMinutes || '—'}</strong> baseline min</span></div><div class="end-actions"><a class="button button-primary" href="#card/${encodeURIComponent(card.id)}">Back to ${escapeHtml(card.game)}</a><a class="button" href="/">All cards</a></div></section>`);
}

function legalView(kind: 'privacy' | 'terms'): string {
  const privacy = `<p class="eyebrow">Plain-language privacy</p><h1>Your notes stay yours.</h1><p class="legal-lede">Comfort Card works without an account and stores your game cards, settings, symptom levels, and session notes in this browser’s IndexedDB storage.</p><h2>What leaves your device</h2><p>Nothing is sent to us. There are no analytics, advertising identifiers, remote fonts, or third-party scripts. If you choose to share or download a card, your browser handles that file or text at your direction.</p><h2>Exports</h2><p>A clean shared card includes the game, optional platform, triggers, and settings plan. It excludes symptom check-ins, session dates, durations, and notes. A full backup includes all locally stored information; treat that file as private.</p><h2>Deleting data</h2><p>Delete an individual card inside the app, or clear this site’s storage in your browser to remove everything. Removing the app may not clear browser data on every device.</p><h2>Contact</h2><p>For privacy questions, contact <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p><p class="legal-date">Effective 28 August 2026</p>`;
  const terms = `<p class="eyebrow">Terms of use</p><h1>A planning tool, not a safety test.</h1><p class="legal-lede">Comfort Card helps you organize personal settings experiments and record how a play session felt. It does not diagnose, prevent, or treat motion sickness.</p><h2>Use your own judgment</h2><p>No setting can make every game comfortable or safe for every person. Stop when you feel unwell. Seek qualified medical advice for severe, unusual, or persistent symptoms.</p><h2>No compatibility promise</h2><p>Setting names and availability vary by game, platform, and version. Suggestions are general options to look for, not claims that a particular game supports them.</p><h2>Your content</h2><p>You own the cards and notes you create. They are stored locally. You are responsible for exports you choose to share.</p><h2>Availability and liability</h2><p>The free service is provided “as is” without warranties. To the extent permitted by law, its maintainers are not liable for loss arising from use of the app.</p><p class="legal-date">Effective 28 August 2026</p>`;
  return shell(`<article class="legal"><a class="back-link" href="/">← Comfort Card</a>${kind === 'privacy' ? privacy : terms}</article>`);
}

function notFoundView(): string {
  return shell(`<section class="error-state"><p class="eyebrow">Card not found</p><h1>That field note is not on this device.</h1><p>It may have been deleted, or the link may belong to another browser.</p><a class="button button-primary" href="/">Return to your cards</a></section>`);
}

function formatTimer(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function render(): void {
  window.clearInterval(timerInterval);
  const path = location.pathname;
  if (path.startsWith('/privacy')) app.innerHTML = legalView('privacy');
  else if (path.startsWith('/terms')) app.innerHTML = legalView('terms');
  else {
    const parts = location.hash.slice(1).split('/').map(decodeURIComponent);
    if (parts[0] === 'new') app.innerHTML = createView();
    else if (parts[0] === 'card') {
      const card = findCard(parts[1]);
      app.innerHTML = card ? cardView(card) : notFoundView();
    } else if (parts[0] === 'session') {
      const card = findCard(parts[1]);
      const session = card?.sessions.find((item) => item.id === parts[2]);
      app.innerHTML = card && session ? sessionView(card, session) : notFoundView();
      if (card && session?.status === 'active') startTimer(session);
    } else if (parts[0] === 'checkin') {
      const card = findCard(parts[1]);
      const session = card?.sessions.find((item) => item.id === parts[2]);
      app.innerHTML = card && session ? checkInView(card, session) : notFoundView();
    } else app.innerHTML = homeView();
  }
  updateOfflineBanner();
}

function startTimer(session: Session): void {
  const tick = () => {
    const output = document.querySelector<HTMLElement>('[data-session-timer]');
    if (!output || session.pausedAt) return;
    const nextAt = (session.checkIns.length + 1) * 15 * 60_000;
    const remaining = Math.max(0, nextAt - elapsedMs(session));
    output.textContent = formatTimer(remaining);
    if (remaining === 0 && output.dataset.due !== 'true') {
      output.dataset.due = 'true';
      showToast('Your 15-minute check-in is ready.');
      navigator.vibrate?.(80);
    }
  };
  tick();
  timerInterval = window.setInterval(tick, 1000);
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4000);
}

function openDialog(id: string): void {
  const dialog = document.querySelector<HTMLDialogElement>(id);
  dialog?.showModal();
}

function closeDialog(button: Element): void {
  button.closest<HTMLDialogElement>('dialog')?.close();
}

function updateOfflineBanner(): void {
  document.querySelectorAll<HTMLElement>('[data-offline-banner]').forEach((banner) => { banner.hidden = navigator.onLine; });
}

function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function syncDraft(): void {
  const form = document.querySelector<HTMLFormElement>('#create-card');
  if (!form || !draft) return;
  const data = new FormData(form);
  draft.game = String(data.get('game') ?? '');
  draft.platform = String(data.get('platform') ?? '');
  draft.baselineMinutes = Number(data.get('baselineMinutes')) || 0;
  draft.triggers = data.getAll('triggers').map(String);
  draft.customTrigger = String(data.get('customTrigger') ?? '');
  draft.settings = draft.settings.map((setting) => ({ ...setting, enabled: data.has(`setting-${setting.id}`) }));
}

async function persist(card: ComfortCard, message = 'Saved on this device.'): Promise<void> {
  card.updatedAt = new Date().toISOString();
  await saveCard(card);
  cards = [card, ...cards.filter((item) => item.id !== card.id)];
  showToast(message);
}

app.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  try {
    if (form.id === 'create-card') {
      syncDraft();
      if (!draft?.game.trim()) {
        formError = 'Enter the game name to make this card.';
        render();
        document.querySelector<HTMLInputElement>('input[name="game"]')?.focus();
        return;
      }
      const card = makeCard(draft);
      await persist(card);
      draft = null;
      formError = '';
      location.hash = `card/${encodeURIComponent(card.id)}`;
    }
    if (form.id === 'start-session') {
      const card = findCard(form.dataset.card ?? '');
      const data = new FormData(form);
      if (!card || data.get('baselineSymptom') === null) return;
      const session = makeSession(Number(data.get('baselineSymptom')));
      card.sessions.unshift(session);
      await persist(card, 'Session started and saved locally.');
      afterCheckIn = false;
      location.hash = `session/${encodeURIComponent(card.id)}/${encodeURIComponent(session.id)}`;
    }
    if (form.id === 'check-in') {
      const card = findCard(form.dataset.card ?? '');
      const session = card?.sessions.find((item) => item.id === form.dataset.session);
      const data = new FormData(form);
      if (!card || !session || data.get('symptomLevel') === null) return;
      session.checkIns.push({
        id: crypto.randomUUID(),
        elapsedMinutes: Math.max(1, Math.round(elapsedMs(session) / 60000)),
        symptomLevel: Number(data.get('symptomLevel')),
        triggersFelt: data.getAll('triggersFelt').map(String),
        note: String(data.get('note') ?? '').trim(),
        createdAt: new Date().toISOString(),
      });
      await persist(card, 'Check-in saved privately.');
      afterCheckIn = true;
      location.hash = `session/${encodeURIComponent(card.id)}/${encodeURIComponent(session.id)}`;
    }
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'That action did not complete.');
  }
});

app.addEventListener('click', async (event) => {
  const target = (event.target as Element).closest<HTMLElement>('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  try {
    if (action === 'move-setting' && draft) {
      syncDraft();
      const from = Number(target.dataset.index);
      const to = from + Number(target.dataset.direction);
      [draft.settings[from], draft.settings[to]] = [draft.settings[to], draft.settings[from]];
      render();
      document.querySelector<HTMLButtonElement>(`[data-action="move-setting"][data-index="${to}"][data-direction="${target.dataset.direction}"]`)?.focus();
    }
    if (action === 'open-start') openDialog('#start-dialog');
    if (action === 'share') openDialog('#share-dialog');
    if (action === 'confirm-delete') openDialog('#delete-dialog');
    if (action === 'stop-now') {
      const parts = location.hash.slice(1).split('/').map(decodeURIComponent);
      const card = findCard(parts[1]);
      const session = card?.sessions.find((item) => item.id === parts[2]);
      if (card && session && !session.pausedAt) {
        session.pausedAt = new Date().toISOString();
        await persist(card, 'Timer paused.');
      }
      openDialog('#stop-dialog');
    }
    if (action === 'close-dialog') closeDialog(target);
    if (action === 'toggle-tried') {
      const card = findCard(target.dataset.card ?? '');
      const setting = card?.settings.find((item) => item.id === target.dataset.setting);
      if (card && setting) { setting.tried = (target as HTMLInputElement).checked; await persist(card); }
    }
    if (action === 'toggle-pause') {
      const card = findCard(target.dataset.card ?? '');
      const session = card?.sessions.find((item) => item.id === target.dataset.session);
      if (card && session) {
        if (session.pausedAt) {
          session.pausedMs += Date.now() - Date.parse(session.pausedAt);
          delete session.pausedAt;
        } else session.pausedAt = new Date().toISOString();
        await persist(card, session.pausedAt ? 'Timer paused.' : 'Timer resumed.');
        render();
      }
    }
    if (action === 'continue-session') { afterCheckIn = false; render(); }
    if (action === 'end-session') {
      const card = findCard(target.dataset.card ?? '');
      const session = card?.sessions.find((item) => item.id === target.dataset.session);
      if (card && session) {
        if (session.pausedAt) session.pausedMs += Date.now() - Date.parse(session.pausedAt);
        delete session.pausedAt;
        session.endedAt = new Date().toISOString();
        session.status = 'ended';
        await persist(card, 'Session ended and saved.');
        afterCheckIn = false;
        render();
      }
    }
    if (action === 'copy-share') {
      const card = findCard(target.dataset.card ?? '');
      if (card) { await navigator.clipboard.writeText(shareText(card)); showToast('Clean card copied. No history included.'); }
    }
    if (action === 'download-share') {
      const card = findCard(target.dataset.card ?? '');
      if (card) { downloadJson(`${card.game.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-comfort-card.json`, buildSharePayload(card)); showToast('Clean card downloaded.'); }
    }
    if (action === 'delete-card') {
      const id = target.dataset.card ?? '';
      await removeCard(id);
      cards = cards.filter((card) => card.id !== id);
      location.hash = '';
      render();
      showToast('Card deleted from this device.');
    }
    if (action === 'backup') {
      if (!cards.length) { showToast('There are no cards to back up yet.'); return; }
      downloadJson(`comfort-card-backup-${new Date().toISOString().slice(0, 10)}.json`, makeBackup(cards));
      showToast('Private backup downloaded. Keep it somewhere safe.');
    }
    if (action === 'open-import') document.querySelector<HTMLInputElement>('#import-file')?.click();
    if (action === 'retry-storage') await loadCards();
    if (action === 'reload-app') location.reload();
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'That action did not complete.');
  }
});

app.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id !== 'import-file' || !input.files?.[0]) return;
  const file = input.files[0];
  file.text().then(async (text) => {
    const result = parseImport(JSON.parse(text) as unknown);
    await importCards(result.cards);
    await loadCards();
    showToast(result.mode === 'share' ? 'Shared card added. No history was included.' : `${result.cards.length} cards restored from backup.`);
  }).catch((error) => showToast(error instanceof Error ? error.message : 'That file could not be imported.'));
  input.value = '';
});

window.addEventListener('hashchange', render);
window.addEventListener('online', updateOfflineBanner);
window.addEventListener('offline', updateOfflineBanner);
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstall = event; });
void deferredInstall;

async function loadCards(): Promise<void> {
  try {
    cards = await getCards();
    storageError = '';
  } catch (error) {
    storageError = error instanceof Error ? error.message : 'Local storage is unavailable.';
  }
  render();
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          const update = document.querySelector<HTMLElement>('#update-toast');
          if (update) update.hidden = false;
        }
      });
    });
  }).catch(() => { /* The app remains usable without installation support. */ });
}

app.innerHTML = shell('<section class="loading-state" aria-busy="true"><p class="eyebrow">Local by design</p><h1>Opening your cards…</h1><p>Reading this device only.</p></section>');
void loadCards();
