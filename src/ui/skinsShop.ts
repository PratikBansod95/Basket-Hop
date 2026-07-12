import type { SaveData } from '../platform/types';
import { equipSkin, ownsSkin, purchaseSkin } from '../shop/skinEconomy';
import {
  RARITY_LABELS,
  SKIN_CATALOG,
  getSkinsTestUnlockAll,
  type SkinRarity,
} from '../shop/skins';
import { getSkinFx } from '../shop/skinFx';

type RarityFilter = 'all' | SkinRarity;

export class SkinsShop {
  private root: HTMLElement;
  private walletEl: HTMLElement;
  private gridEl: HTMLElement;
  private filter: RarityFilter = 'all';
  private save: SaveData | null = null;
  private onChange: ((save: SaveData) => void) | null = null;

  constructor() {
    this.root = document.getElementById('skins-shop')!;
    this.walletEl = this.root.querySelector('#skins-shop-wallet')!;
    this.gridEl = this.root.querySelector('#skins-shop-grid')!;

    this.root.querySelector('#skins-shop-close')!.addEventListener('click', () => this.hide());
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.hide();
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-rarity-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.filter = (btn.dataset.rarityFilter as RarityFilter) || 'all';
        this.syncFilterButtons();
        this.renderGrid();
      });
    });
  }

  show(save: SaveData, onChange: (save: SaveData) => void): void {
    this.save = save;
    this.onChange = onChange;
    this.filter = 'all';
    this.syncFilterButtons();
    this.walletEl.textContent = String(save.coins);
    this.renderGrid();
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
  }

  isVisible(): boolean {
    return !this.root.classList.contains('hidden');
  }

  private syncFilterButtons(): void {
    this.root.querySelectorAll<HTMLButtonElement>('[data-rarity-filter]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.rarityFilter === this.filter);
    });
  }

  private renderGrid(): void {
    if (!this.save) return;
    const save = this.save;
    const skins =
      this.filter === 'all'
        ? SKIN_CATALOG
        : SKIN_CATALOG.filter((skin) => skin.rarity === this.filter);

    this.gridEl.innerHTML = '';
    for (const skin of skins) {
      const owned = ownsSkin(save, skin.id);
      const equipped = save.equippedSkin === skin.id;
      const canBuy = !owned && !getSkinsTestUnlockAll() && save.coins >= skin.price;
      const card = document.createElement('button');
      const fx = getSkinFx(skin.id);
      card.type = 'button';
      card.className = `skins-card rarity-${skin.rarity}`;
      if (fx.kind !== 'none') card.classList.add(`fx-${fx.kind}`);
      if (equipped) card.classList.add('is-equipped');
      if (!owned && !getSkinsTestUnlockAll()) card.classList.add('is-locked');
      if (fx.kind !== 'none') {
        card.style.setProperty('--skin-fx-glow', fx.shopGlow);
      }

      let actionLabel: string;
      if (equipped) actionLabel = 'Equipped';
      else if (owned || getSkinsTestUnlockAll()) actionLabel = 'Equip';
      else if (skin.price <= 0) actionLabel = 'Unlock';
      else actionLabel = `${skin.price} coins`;

      card.innerHTML = `
        <span class="skins-card-index">${skin.index}</span>
        <span class="skins-card-preview">
          <img src="${skin.asset}" alt="" width="96" height="96" loading="lazy" draggable="false" />
        </span>
        <span class="skins-card-name">${skin.name}</span>
        <span class="skins-card-rarity">${RARITY_LABELS[skin.rarity]}</span>
        <span class="skins-card-action">${actionLabel}</span>
      `;

      if (equipped) {
        card.disabled = true;
      } else if (owned || getSkinsTestUnlockAll()) {
        card.addEventListener('click', () => this.handleEquip(skin.id));
      } else if (canBuy || skin.price <= 0) {
        card.addEventListener('click', () => this.handleBuy(skin.id));
      } else {
        card.disabled = true;
        card.classList.add('is-broke');
      }

      this.gridEl.appendChild(card);
    }
  }

  private commit(next: SaveData): void {
    this.save = next;
    this.walletEl.textContent = String(next.coins);
    this.onChange?.(next);
    this.renderGrid();
  }

  private handleEquip(skinId: string): void {
    if (!this.save) return;
    const next = equipSkin(this.save, skinId);
    if (!next) return;
    this.commit(next);
  }

  private handleBuy(skinId: string): void {
    if (!this.save) return;
    const result = purchaseSkin(this.save, skinId);
    if (!result.ok) return;
    const equipped = equipSkin(result.save, skinId) ?? result.save;
    this.commit(equipped);
  }
}
