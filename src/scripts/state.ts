// Global state management
type Theme = 'day' | 'night' | 'system';
type Motion = 'full' | 'reduced' | 'system';
type PlayerClass = 'all' | 'gameplay' | 'systems';

interface AppState {
  theme: Theme;
  motion: Motion;
  playerClass: PlayerClass;
  soundEnabled: boolean;
  volume: number;
  arcadeMode: boolean;
  keyboardShortcuts: boolean;
  showCoins: boolean;
}

const defaultState: AppState = {
  theme: 'night',
  motion: 'full',
  playerClass: 'all',
  soundEnabled: false,
  volume: 0.5,
  arcadeMode: false,
  keyboardShortcuts: true,
  showCoins: false
};

class StateManager {
  private state: AppState;

  constructor() {
    this.state = { ...defaultState };
    this.loadState();
    this.bindEvents();
    this.applyState(true);
  }

  private loadState() {
    try {
      const saved = localStorage.getItem('beerstudios_save_v1');
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load save data', e);
    }
  }

  private saveState() {
    try {
      localStorage.setItem('beerstudios_save_v1', JSON.stringify(this.state));
    } catch (e) {}
  }

  private bindEvents() {
    // Theme Segmented Control
    document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.theme = (e.currentTarget as HTMLButtonElement).dataset.themeBtn as Theme;
        this.applyState();
      });
    });

    // Motion Segmented Control
    document.querySelectorAll<HTMLButtonElement>('[data-motion-btn]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.motion = (e.currentTarget as HTMLButtonElement).dataset.motionBtn as Motion;
        this.applyState();
      });
    });

    // Player Class Radios
    document.querySelectorAll<HTMLInputElement>('input[name="playerClass"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.playerClass = (e.target as HTMLInputElement).value as PlayerClass;
        
        // Update styling of class options
        document.querySelectorAll('.class-option').forEach(opt => opt.classList.remove('is-selected'));
        (e.target as HTMLInputElement).closest('.class-option')?.classList.add('is-selected');
        
        this.applyState();
        
        // Custom event for achievement
        if (this.state.playerClass !== 'all') {
          window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id: 'class-act' }}));
        }
      });
    });

    const applyBtn = document.getElementById('btn-apply-class');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        if ((window as any).ModalManager) {
          (window as any).ModalManager.closeMenu();
        }
        window.location.hash = '#levels';
      });
    }

    const resetBtn = document.getElementById('btn-reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
          localStorage.removeItem('beerstudios_save_v1');
          localStorage.removeItem('beerstudios_achievements_v1');
          window.location.reload();
        }
      });
    }

    // Toggles
    const setupToggle = (id: string, key: keyof AppState, customAction?: (val: boolean) => void) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      
      btn.addEventListener('click', () => {
        const newVal = !this.state[key];
        (this.state as any)[key] = newVal;
        if (customAction) customAction(newVal);
        this.applyState();
      });
    };

    setupToggle('btn-toggle-sound', 'soundEnabled');
    setupToggle('btn-toggle-keyboard', 'keyboardShortcuts');
    setupToggle('btn-toggle-coins', 'showCoins');
    setupToggle('btn-toggle-arcade', 'arcadeMode', (val) => {
      if (val) window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id: 'old-school' }}));
    });

    // Volume Slider
    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.state.volume = parseFloat((e.target as HTMLInputElement).value);
        this.saveState();
      });
    }

    // Grid filters
    document.querySelectorAll<HTMLButtonElement>('.filter-chip').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(t => {
          t.setAttribute('aria-pressed', 'false');
        });
        tab.setAttribute('aria-pressed', 'true');
        
        this.filterGrid(tab.dataset.filter || 'all');
      });
    });
    
    // Grid sorting
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.sortGrid(sortSelect.value);
      });
    }

    // Skill Nodes Interactive Map
    document.querySelectorAll<HTMLButtonElement>('.skill-node').forEach(node => {
      node.addEventListener('click', () => {
        const projects = node.dataset.projects?.split(',').filter(Boolean) || [];
        
        // Remove highlight from all cards
        document.querySelectorAll('.card').forEach(card => card.classList.remove('highlighted-skill'));
        
        if (node.classList.contains('active')) {
          node.classList.remove('active');
        } else {
          document.querySelectorAll('.skill-node').forEach(n => n.classList.remove('active'));
          node.classList.add('active');
          
          projects.forEach(p => {
            const card = document.getElementById(`project-${p.trim()}`);
            if (card) {
              card.classList.add('highlighted-skill');
            }
          });
        }
      });
    });
  }

  private applyState(isInitial = false) {
    const root = document.documentElement;

    // Theme
    let activeTheme = this.state.theme;
    if (activeTheme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night';
    }
    root.dataset.theme = activeTheme;

    // Motion
    let activeMotion = this.state.motion;
    if (activeMotion === 'system') {
      activeMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
    }
    root.dataset.motion = activeMotion;

    // Show coins
    root.dataset.showCoins = this.state.showCoins.toString();

    // Arcade
    root.dataset.arcade = this.state.arcadeMode.toString();

    // Sync UI elements
    const syncSegment = (attr: string, val: string) => {
      document.querySelectorAll(`[${attr}]`).forEach(btn => {
        const isMatch = (btn as HTMLElement).getAttribute(attr) === val;
        btn.setAttribute('aria-pressed', isMatch.toString());
      });
    };
    
    syncSegment('data-theme-btn', this.state.theme);
    syncSegment('data-motion-btn', this.state.motion);

    const radio = document.querySelector(`input[name="playerClass"][value="${this.state.playerClass}"]`) as HTMLInputElement;
    if (radio) radio.checked = true;

    // Sync Toggles
    const syncToggle = (id: string, val: boolean) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.setAttribute('aria-pressed', val.toString());
        if (val) btn.classList.add('is-on');
        else btn.classList.remove('is-on');
        
        const textSpan = btn.querySelector('.toggle-text');
        if (textSpan) {
          textSpan.textContent = val ? 'ON' : 'OFF';
        }
      }
    };

    syncToggle('btn-toggle-sound', this.state.soundEnabled);
    syncToggle('btn-toggle-keyboard', this.state.keyboardShortcuts);
    syncToggle('btn-toggle-coins', this.state.showCoins);
    syncToggle('btn-toggle-arcade', this.state.arcadeMode);

    // Sync Volume
    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    if (volumeSlider) {
      volumeSlider.disabled = !this.state.soundEnabled;
      volumeSlider.value = this.state.volume.toString();
    }
    
    // Sync HUD Class Label
    const classLabel = document.getElementById('hud-class-label');
    if (classLabel) {
      if (this.state.playerClass === 'all') classLabel.textContent = 'All';
      else if (this.state.playerClass === 'gameplay') classLabel.textContent = 'Gameplay';
      else if (this.state.playerClass === 'systems') classLabel.textContent = 'Systems';
    }
    
    // Sync class options visual state
    document.querySelectorAll('.class-option').forEach(opt => opt.classList.remove('is-selected'));
    document.querySelector(`input[name="playerClass"][value="${this.state.playerClass}"]`)?.closest('.class-option')?.classList.add('is-selected');

    // Filter projects based on class
    if (!isInitial) {
      this.filterGridByClass();
    }

    this.saveState();
  }
  
  private filterGridByClass() {
    if (!this.state.playerClass) return;
    
    // Sort logic using Player Class orders if specified
    ['grid-featured', 'grid-side'].forEach(gridId => {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      
      const cards = Array.from(grid.querySelectorAll('.card')) as HTMLElement[];
      if (this.state.playerClass === 'gameplay') {
        cards.sort((a, b) => {
          const orderA = parseInt(a.getAttribute('data-order-gameplay') || '999');
          const orderB = parseInt(b.getAttribute('data-order-gameplay') || '999');
          return orderA - orderB;
        });
      } else if (this.state.playerClass === 'systems') {
        cards.sort((a, b) => {
          const orderA = parseInt(a.getAttribute('data-order-systems') || '999');
          const orderB = parseInt(b.getAttribute('data-order-systems') || '999');
          return orderA - orderB;
        });
      }
      
      cards.forEach(card => grid.appendChild(card));
    });
    
    // If a class is selected, simulate clicking the corresponding filter tab
    const tab = document.querySelector(`.filter-chip[data-filter="${this.state.playerClass}"]`) as HTMLButtonElement;
    if (tab) tab.click();
  }

  private filterGrid(filter: string) {
    let visibleCount = 0;
    document.querySelectorAll('.card').forEach((el) => {
      const card = el as HTMLElement;
      const track = card.dataset.track;
      
      if (filter === 'all' || track === filter || track === 'both') {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    const emptyState = document.getElementById('grid-empty');
    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }
  
  private sortGrid(sortMode: string) {
    ['grid-featured', 'grid-side'].forEach(gridId => {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      
      const cards = Array.from(grid.querySelectorAll('.card')) as HTMLElement[];
      cards.sort((a, b) => {
        if (sortMode === 'stage') {
          const stageA = (a.querySelector('.card-stage')?.textContent || '').replace('STAGE ', '').split('-');
          const stageB = (b.querySelector('.card-stage')?.textContent || '').replace('STAGE ', '').split('-');
          const wA = parseInt(stageA[0] || '0', 10), lA = parseInt(stageA[1] || '0', 10);
          const wB = parseInt(stageB[0] || '0', 10), lB = parseInt(stageB[1] || '0', 10);
          return wA !== wB ? wA - wB : lA - lB;
        } else {
          return parseInt(a.dataset.order || '0') - parseInt(b.dataset.order || '0');
        }
      });
      
      // Re-append to DOM
      cards.forEach(card => grid.appendChild(card));
    });
  }

  public getState() {
    return this.state;
  }
}

export const stateManager = new StateManager();
// Expose for other scripts if needed
(window as any).AppState = stateManager;

// On load, apply class filtering
document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('.filter-chip[aria-pressed="true"]') as HTMLButtonElement;
  if (activeTab) {
    activeTab.click();
  }
});
