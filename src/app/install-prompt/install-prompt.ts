import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-install-prompt',
  templateUrl: './install-prompt.html',
  styleUrl: './install-prompt.scss',
})
export class InstallPromptComponent {
  showPrompt = signal(false);
  deferredPrompt: any = null;

  constructor() {
    this.checkInstallability();
  }

  checkInstallability() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed before
    if (localStorage.getItem('installPromptDismissed')) {
      return;
    }

    // For iOS
    if (this.isIOS() && !this.isInStandaloneMode()) {
      setTimeout(() => this.showPrompt.set(true), 2000);
      return;
    }

    // For Chrome/Edge/other browsers with BeforeInstallPrompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showPrompt.set(true);
    });
  }

  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  isInStandaloneMode(): boolean {
    return (
      ('standalone' in window.navigator && (window.navigator as any).standalone) ||
      window.matchMedia('(display-mode: standalone)').matches
    );
  }

  async install() {
    if (!this.deferredPrompt) {
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.showPrompt.set(false);
    }

    this.deferredPrompt = null;
  }

  dismiss() {
    this.showPrompt.set(false);
    localStorage.setItem('installPromptDismissed', 'true');
  }
}
