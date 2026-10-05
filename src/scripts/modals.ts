class ModalManager {
  private menu: HTMLDialogElement | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private tabs: HTMLElement[] = [];
  private panels: HTMLElement[] = [];
  
  private tabMapping: Record<string, string> = {
    'modal-class': 'player',
    'modal-achievements': 'trophies',
    'modal-settings': 'settings',
    'modal-controls': 'controls'
  };

  constructor() {
    this.bindEvents();
    
    // Bind dynamically if Astro View Transitions happen
    document.addEventListener('astro:page-load', () => {
      this.menu = document.getElementById('system-menu') as HTMLDialogElement;
      this.rebindDOM();
    });
  }

  private rebindDOM() {
    if (!this.menu) return;
    this.tabs = Array.from(this.menu.querySelectorAll('.system-tab-btn'));
    this.panels = Array.from(this.menu.querySelectorAll('.system-tab-panel'));
    
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = (e.currentTarget as HTMLElement).dataset.tab;
        if (targetTab) this.switchTab(targetTab);
      });
    });

    // Keyboard navigation for tabs
    this.menu.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = this.tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
        if (currentIndex === -1) return;
        
        let newIndex = currentIndex;
        if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
        if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % this.tabs.length;
        
        this.switchTab(this.tabs[newIndex].dataset.tab as string);
        this.tabs[newIndex].focus();
      }
    });
  }

  private bindEvents() {
    // Open triggers
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('[data-open-modal]') as HTMLElement;
      if (btn) {
        const modalId = btn.dataset.openModal;
        if (modalId && this.tabMapping[modalId]) {
          this.openMenu(this.tabMapping[modalId]);
        }
      }
      
      const closeBtn = target.closest('[data-close-menu]');
      if (closeBtn) {
        this.closeMenu();
      }
    });

    document.addEventListener('click', ((e: MouseEvent) => {
      if (!this.menu || !this.menu.open) return;
      const target = e.target as HTMLElement;
      // Close on backdrop click
      if (target === this.menu) {
        const rect = this.menu.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          this.closeMenu();
        }
      }
    }) as EventListener);

    // Initial bind
    window.addEventListener('DOMContentLoaded', () => {
      this.menu = document.getElementById('system-menu') as HTMLDialogElement;
      this.rebindDOM();
      
      if (this.menu) {
        this.menu.addEventListener('close', () => {
          if (this.previouslyFocused) {
            this.previouslyFocused.focus();
          }
          if ((window as any).SoundManager) {
            (window as any).SoundManager.play('menuClose');
          }
        });
      }
    });
  }

  public openMenu(tabId: string) {
    if (!this.menu) this.menu = document.getElementById('system-menu') as HTMLDialogElement;
    if (!this.menu) return;
    
    this.previouslyFocused = document.activeElement as HTMLElement;
    
    this.switchTab(tabId);
    
    if (!this.menu.open) {
      if ((window as any).SoundManager) {
        (window as any).SoundManager.play('menuOpen');
      }
      this.menu.showModal();
    }
  }
  
  public openModal(oldId: string) {
    // Legacy support for keyboard.ts
    if (this.tabMapping[oldId]) {
      this.openMenu(this.tabMapping[oldId]);
    }
  }

  public closeMenu() {
    if (this.menu && this.menu.open) {
      this.menu.close(); // native close will trigger the 'close' event and sound
    }
  }

  private switchTab(tabId: string) {
    if (!this.tabs.length) this.rebindDOM();
    
    this.tabs.forEach(tab => {
      const isSelected = tab.dataset.tab === tabId;
      tab.setAttribute('aria-selected', isSelected.toString());
      tab.classList.toggle('is-active', isSelected);
      
      // Update title text
      if (isSelected) {
        const titleEl = document.getElementById('system-menu-title');
        if (titleEl) titleEl.textContent = tab.querySelector('.tab-label')?.textContent || '';
      }
    });
    
    this.panels.forEach(panel => {
      const isActive = panel.id === `tab-${tabId}`;
      if (isActive) {
        panel.hidden = false;
        // accessibility
        const focusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (focusable) focusable.focus();
      } else {
        panel.hidden = true;
      }
    });
  }
}

export const modalManager = new ModalManager();
(window as any).ModalManager = modalManager;
