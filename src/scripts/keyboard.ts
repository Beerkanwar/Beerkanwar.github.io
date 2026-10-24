class KeyboardManager {
  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if typing in input, select, or if modifier is pressed
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      // Suppress shortcuts if Konami code sequence is mid-match (M7)
      if ((window as any).Konami?.isSuppressingShortcuts()) return;
      
      let state = { keyboardShortcuts: true };
      if ((window as any).AppState) {
        state = (window as any).AppState.getState();
      }
      if (!state.keyboardShortcuts) return;

      const modalManager = (window as any).ModalManager;
      
      switch (e.key.toLowerCase()) {
        case 'p':
          if (modalManager) modalManager.openMenu('player');
          break;
        case 's':
          if (modalManager) modalManager.openMenu('settings');
          break;
        case 'a':
          if (modalManager) modalManager.openMenu('trophies');
          break;
        case '?':
          if (modalManager) modalManager.openMenu('controls');
          window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id: 'curious' }}));
          break;
        case 'm':
          // Toggle mute
          const muteBtn = document.getElementById('btn-toggle-sound');
          if (muteBtn) muteBtn.click();
          break;
        case 'c':
          const commSection = document.getElementById('commissions');
          if (commSection) {
            commSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.hash = '#commissions';
          }
          break;
        case '1':
          window.location.hash = '#levels';
          break;
        case '2':
          window.location.hash = '#skills';
          break;
        case '3':
          window.location.hash = '#quests';
          break;
        case '4':
          window.location.hash = '#contact';
          break;
      }
    });
  }
}

export const keyboardManager = new KeyboardManager();
