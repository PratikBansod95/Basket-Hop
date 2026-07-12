import type { LeaderboardEntry } from '../../shared/contracts/leaderboard';
import { fetchLeaderboard } from '../services/api/leaderboard';
import type { SaveData } from '../platform/types';

const AVATAR_PALETTE = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#9b59b6',
  '#f39c12',
  '#1abc9c',
  '#e67e22',
  '#34495e',
];

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

function getRankTheme(rank: number): string {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'court';
}

function avatarColor(nickname: string): string {
  let hash = 0;
  for (let i = 0; i < nickname.length; i += 1) {
    hash = (hash * 31 + nickname.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function createAvatar(nickname: string): HTMLElement {
  const avatar = document.createElement('div');
  avatar.className = 'league-avatar';
  avatar.style.background = `linear-gradient(180deg, ${avatarColor(nickname)}, ${avatarColor(nickname)}cc)`;
  avatar.textContent = getInitial(nickname);
  avatar.setAttribute('aria-hidden', 'true');
  return avatar;
}

function createLeagueRow(entry: LeaderboardEntry, isPlayerRow = false): HTMLElement {
  const row = document.createElement('article');
  row.className = 'league-row';
  row.classList.toggle('is-player', isPlayerRow);
  row.classList.add(`is-${getRankTheme(entry.rank)}`);

  const rank = document.createElement('span');
  rank.className = 'league-rank';
  rank.textContent = `${entry.rank}.`;

  const name = document.createElement('span');
  name.className = 'league-name';
  name.textContent = entry.nickname;
  name.title = entry.nickname;

  const score = document.createElement('span');
  score.className = 'league-score';
  score.textContent = String(entry.score);

  row.append(rank, createAvatar(entry.nickname), name, score);
  return row;
}

function createDivider(label: string): HTMLElement {
  const divider = document.createElement('div');
  divider.className = 'league-divider';
  divider.textContent = label;
  return divider;
}

function createEmptyState(message: string): HTMLElement {
  const empty = document.createElement('p');
  empty.className = 'league-empty';
  empty.textContent = message;
  return empty;
}

export class LeaderboardOverlay {
  private root: HTMLElement;
  private list: HTMLElement;
  private loadingEl: HTMLElement;
  private errorEl: HTMLElement;
  private visible = false;
  private opening = false;
  private lastOpenAt = 0;

  constructor(private getSave: () => SaveData) {
    this.root = document.getElementById('leaderboard-screen')!;
    this.list = document.getElementById('leaderboardList')!;
    this.loadingEl = document.getElementById('leaderboardLoading')!;
    this.errorEl = document.getElementById('leaderboardError')!;

    document.getElementById('btn-leaderboard-close')!.addEventListener('click', (event) => {
      event.stopPropagation();
      this.hide();
    });
    this.root.addEventListener('click', (event) => {
      if (event.target === this.root) this.hide();
    });
  }

  isOpen(): boolean {
    return this.visible;
  }

  async show(): Promise<void> {
    const now = Date.now();
    if (this.opening || this.visible || now - this.lastOpenAt < 400) return;
    this.opening = true;
    this.lastOpenAt = now;
    this.visible = true;
    this.root.classList.remove('hidden');
    try {
      await this.refresh();
    } finally {
      this.opening = false;
    }
  }

  hide(): void {
    this.visible = false;
    this.root.classList.add('hidden');
  }

  private setLoading(loading: boolean): void {
    this.loadingEl.classList.toggle('hidden', !loading);
  }

  private setError(message: string): void {
    this.errorEl.textContent = message;
    this.errorEl.classList.toggle('hidden', message.length === 0);
  }

  private render(entries: LeaderboardEntry[], playerEntry: LeaderboardEntry | null, playerId: string): void {
    this.list.replaceChildren();
    const entryIds = new Set(entries.map((entry) => entry.playerId));
    const playerInList = Boolean(playerEntry && entryIds.has(playerEntry.playerId));

    for (const entry of entries) {
      this.list.append(createLeagueRow(entry, entry.playerId === playerId));
    }

    if (playerEntry && !playerInList) {
      this.list.append(createDivider('YOUR RANK'), createLeagueRow(playerEntry, true));
    }

    if (entries.length === 0 && !playerEntry) {
      this.list.append(createEmptyState('No scores yet. Play a run and claim rank #1!'));
    }
  }

  async refresh(): Promise<void> {
    this.setLoading(true);
    this.setError('');
    const save = this.getSave();

    try {
      const data = await fetchLeaderboard(save.playerId, 100);
      if (data.entries.length === 0 && !data.playerEntry) {
        this.list.replaceChildren(
          createEmptyState('No scores yet. Be the first hopper on the board.'),
        );
        return;
      }
      this.render(data.entries, data.playerEntry, save.playerId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not load leaderboard right now.';
      this.list.replaceChildren(createEmptyState(message));
      this.setError(message);
    } finally {
      this.setLoading(false);
    }
  }
}
