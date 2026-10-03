class ModalManager {
  private activeModal: HTMLDialogElement | null = null;
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    // Open triggers
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = (e.currentTarget as HTMLElement).dataset.openModal;
        if (modalId) this.openModal(modalId);
      });
    });

    // Close triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Native dialog close sync (Escape key or form submission)
    document.querySelectorAll('dialog.pixel-modal').forEach((d) => {
      const dialog = d as HTMLDialogElement;
      dialog.addEventListener('close', () => {
        if (this.activeModal === dialog) {
          this.activeModal = null;
          if (this.previouslyFocused) {
            this.previouslyFocused.focus();
          }
          if ((window as any).SoundManager) {
            (window as any).SoundManager.play('menuClose');
          }
        }
      });
    });

    // Click outside
    document.querySelectorAll('dialog.pixel-modal').forEach(dialog => {
      dialog.addEventListener('click', ((e: MouseEvent) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          this.closeModal();
        }
      }) as EventListener);
    });

    // Handle escape key globally to be safe (though native dialog handles it, we let the native event sync state)
  }

  public openModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (!modal) return;
    
    // Close existing
    if (this.activeModal) {
      this.closeModal();
    }
    
    this.previouslyFocused = document.activeElement as HTMLElement;
    this.activeModal = modal;
    
    // Play sound if SoundManager exists
    if ((window as any).SoundManager) {
      (window as any).SoundManager.play('menuOpen');
    }

    modal.showModal();
    
    // Accessibility: focus first focusable element
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
    if (focusable) focusable.focus();
  }

  public closeModal() {
    if (!this.activeModal) return;
    
    const modal = this.activeModal;
    
    // Play sound
    if ((window as any).SoundManager) {
      (window as any).SoundManager.play('menuClose');
    }
    
    modal.close();
    // State sync is handled by the 'close' event listener added above
  }
}

export const modalManager = new ModalManager();
(window as any).ModalManager = modalManager;
