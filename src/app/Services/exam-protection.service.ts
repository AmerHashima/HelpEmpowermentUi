import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type ViolationType =
  | 'TAB_SWITCH'
  | 'FULLSCREEN_EXIT'
  | 'DEVTOOLS'
  | 'IDLE'
  | 'KEYBOARD'
  | 'FAST_SWITCH';

interface ViolationLog {
  type: ViolationType;
  timestamp: number;
}

@Injectable()
export class ExamProtectionService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private active = false;
  private violations = 0;
  private maxViolations = 3;

  private logs: ViolationLog[] = [];

  private visibilityHandler!: () => void;
  private fullscreenHandler!: () => void;
  private keydownHandler!: (e: KeyboardEvent) => void;

  private devToolsInterval: any;
  private idleTimer: any;
  private lastLeaveTime = 0;
  private lastKeyboardViolation = 0;

  private contextMenuHandler = (e: Event) => e.preventDefault();
  private copyHandler = (e: Event) => e.preventDefault();

  init(
    onViolation: (type: ViolationType) => void,
    onTerminate: () => void
  ) {
    if (!this.isBrowser || this.active) return;

    this.visibilityHandler = () => {
      if (document.hidden) {
        this.lastLeaveTime = Date.now();
      } else {
        const diff = Date.now() - this.lastLeaveTime;

        if (diff < 2000) {
          this.handleViolation('FAST_SWITCH', onViolation, onTerminate);
        } else {
          this.handleViolation('TAB_SWITCH', onViolation, onTerminate);
        }
      }
    };

    this.fullscreenHandler = () => {
      if (!document.fullscreenElement) {
        this.handleViolation('FULLSCREEN_EXIT', onViolation, onTerminate);
      }
    };

    this.keydownHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      const isShortcut =
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'a', 'u', 's'].includes(key);

      const isDevToolsKey = key === 'f12';

      if (isShortcut || isDevToolsKey) {
        e.preventDefault();

        const now = Date.now();
        if (now - this.lastKeyboardViolation > 1500) {
          this.lastKeyboardViolation = now;
          this.handleViolation('KEYBOARD', onViolation, onTerminate);
        }
      }
    };

    this.devToolsInterval = setInterval(() => {
      const threshold = 160;
      const opened =
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold;

      if (opened) {
        this.handleViolation('DEVTOOLS', onViolation, onTerminate);
      }
    }, 1000);

    const resetIdle = () => {
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.handleViolation('IDLE', onViolation, onTerminate);
      }, 60000);
    };

    ['mousemove', 'keydown', 'click'].forEach(event =>
      document.addEventListener(event, resetIdle)
    );

    resetIdle();

    document.addEventListener('visibilitychange', this.visibilityHandler);
    document.addEventListener('fullscreenchange', this.fullscreenHandler);
    document.addEventListener('keydown', this.keydownHandler);
    document.addEventListener('contextmenu', this.contextMenuHandler);
    document.addEventListener('copy', this.copyHandler);

    this.active = true;
  }

  private handleViolation(
    type: ViolationType,
    onViolation: (type: ViolationType) => void,
    onTerminate: () => void
  ) {
    this.violations++;

    this.logs.push({
      type,
      timestamp: Date.now()
    });

    if (this.violations >= this.maxViolations) {
      onTerminate();
      return;
    }

    onViolation(type);
  }

  enterFullscreen() {
    if (!this.isBrowser) return;
    document.documentElement.requestFullscreen?.().catch(() => { });
  }

  destroy() {
    if (!this.isBrowser || !this.active) return;

    document.removeEventListener('visibilitychange', this.visibilityHandler);
    document.removeEventListener('fullscreenchange', this.fullscreenHandler);
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener('contextmenu', this.contextMenuHandler);
    document.removeEventListener('copy', this.copyHandler);

    clearInterval(this.devToolsInterval);
    clearTimeout(this.idleTimer);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }

    this.active = false;
    this.violations = 0;
    this.logs = [];
  }

  getLogs() {
    return this.logs;
  }
}
