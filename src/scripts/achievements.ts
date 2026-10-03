import { ACHIEVEMENTS } from '../data/achievements';

class AchievementManager {
  private unlockedIds: Set<string> = new Set();
  private collectedCoins: Set<number> = new Set();
  private toastContainer: HTMLElement | null = null;
  private totalAchievements = ACHIEVEMENTS.length;

  constructor() {
    this.toastContainer = document.getElementById('toast-container');
    this.loadState();
    this.bindEvents();
    this.updateUI();
  }

  private loadState() {
    try {
      const saved = localStorage.getItem('beerstudios_achievements_v1');
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.unlockedIds)) this.unlockedIds = new Set(data.unlockedIds);
        if (Array.isArray(data.collectedCoins)) this.collectedCoins = new Set(data.collectedCoins);
      }
    } catch (e) {}
  }

  private saveState() {
    try {
      localStorage.setItem('beerstudios_achievements_v1', JSON.stringify({
        unlockedIds: Array.from(this.unlockedIds),
        collectedCoins: Array.from(this.collectedCoins)
      }));
    } catch (e) {}
  }

  private bindEvents() {
    // Custom event listener for arbitrary unlocks
    window.addEventListener('achievement-unlocked', ((e: CustomEvent) => {
      this.unlock(e.detail.id);
    }) as EventListener);

    // Coin clicks
    document.querySelectorAll('.pixel-coin').forEach(coinEl => {
      coinEl.addEventListener('click', (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const coinId = parseInt(btn.dataset.coinId || '0');
        
        if (coinId && !this.collectedCoins.has(coinId)) {
          this.collectedCoins.add(coinId);
          btn.classList.add('is-collected');
          btn.setAttribute('aria-label', 'Coin Collected');
          
          if ((window as any).SoundManager) {
            (window as any).SoundManager.play('coin');
          }
          
          this.saveState();
          this.updateUI();
          this.checkCoinAchievements();
        }
      });
    });

    // Email copy
    const copyBtn = document.getElementById('btn-copy-email');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('contact-email-input') as HTMLInputElement;
        if (emailInput) {
          navigator.clipboard.writeText(emailInput.value).then(() => {
            this.unlock('hello-world');
          });
        }
      });
    }


  }

  private checkCoinAchievements() {
    const count = this.collectedCoins.size;
    if (count >= 7) {
      this.unlock('coin-collector');
      const bonusContainer = document.getElementById('bonus-reveal-container');
      if (bonusContainer) bonusContainer.hidden = false;
    }
  }

  public unlock(id: string) {
    if (this.unlockedIds.has(id)) return;
    
    const achievementDef = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievementDef) return;

    this.unlockedIds.add(id);
    this.saveState();
    this.updateUI();
    this.showToast(achievementDef);

    if ((window as any).SoundManager) {
      (window as any).SoundManager.play('success');
    }
  }

  private showToast(achievement: typeof ACHIEVEMENTS[0]) {
    if (!this.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">🏆</div>
      <div class="toast-content">
        <div class="toast-title">Achievement Unlocked!</div>
        <div class="toast-desc">${achievement.title}</div>
      </div>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Remove after 4s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (this.toastContainer?.contains(toast)) {
          this.toastContainer.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  private updateUI() {
    // HUD coin counter
    const counter = document.getElementById('hud-coin-count');
    if (counter) {
      counter.textContent = this.collectedCoins.size.toString();
    }
    
    // HUD XP Bar
    const xpFill = document.getElementById('xp-fill');
    if (xpFill) {
      const percentage = (this.unlockedIds.size / this.totalAchievements) * 100;
      xpFill.style.width = `${percentage}%`;
    }

    // Modal Count
    const modalCount = document.getElementById('achievement-count-display');
    if (modalCount) {
      modalCount.textContent = this.unlockedIds.size.toString();
    }

    // Modal Cards
    this.unlockedIds.forEach(id => {
      const card = document.querySelector(`.achievement-card[data-achievement-id="${id}"]`);
      if (card) {
        card.classList.remove('is-locked');
      }
    });

    // Sync coins in DOM
    this.collectedCoins.forEach(id => {
      const coin = document.querySelector(`.pixel-coin[data-coin-id="${id}"]`);
      if (coin) {
        coin.classList.add('is-collected');
        coin.setAttribute('aria-label', 'Coin Collected');
      }
    });
  }
}

export const achievementManager = new AchievementManager();
