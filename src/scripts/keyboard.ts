class KeyboardManager {
  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if typing in input or if disabled
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      let state = { keyboardShortcuts: true };
      if ((window as any).AppState) {
        state = (window as any).AppState.getState();
      }
      if (!state.keyboardShortcuts) return;

      const modalManager = (window as any).ModalManager;
      
      switch (e.key.toLowerCase()) {
        case 's':
          if (modalManager) modalManager.openModal('modal-settings');
          break;
        case 'a':
          if (modalManager) modalManager.openModal('modal-achievements');
          break;
        case 'm':
          // Toggle mute
          const muteBtn = document.getElementById('btn-toggle-sound');
          if (muteBtn) muteBtn.click();
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
