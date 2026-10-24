class KonamiCode {
  private sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private current = 0;
  private lastMatchTime = 0;

  constructor() {
    (window as any).Konami = this;
    // Capture phase so Konami sequence is checked before shortcut listeners (M7)
    document.addEventListener('keydown', (e) => {
      // Ignore inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      if (e.key === this.sequence[this.current] || e.key.toLowerCase() === this.sequence[this.current]) {
        this.current++;
        if (this.current === this.sequence.length) {
          this.lastMatchTime = Date.now();
          this.activate();
          this.current = 0;
        }
      } else {
        if (e.key === this.sequence[0]) {
          this.current = 1;
        } else {
          this.current = 0;
        }
      }
    }, true);
  }

  public isSuppressingShortcuts(): boolean {
    return this.current > 0 || (Date.now() - this.lastMatchTime < 600);
  }

  private activate() {
    window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id: 'old-school' }}));
    
    const arcadeBtn = document.getElementById('btn-toggle-arcade');
    if (arcadeBtn && !arcadeBtn.classList.contains('is-on')) {
      arcadeBtn.click();
    }
  }
}

export const konami = new KonamiCode();
