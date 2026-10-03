class KonamiCode {
  private sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private current = 0;

  constructor() {
    document.addEventListener('keydown', (e) => {
      // Ignore inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === this.sequence[this.current] || e.key.toLowerCase() === this.sequence[this.current]) {
        this.current++;
        if (this.current === this.sequence.length) {
          this.activate();
          this.current = 0;
        }
      } else {
        this.current = 0;
      }
    });
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
