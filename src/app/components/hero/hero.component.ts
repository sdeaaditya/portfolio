import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type ScreenMode = 'profile' | 'terminal' | 'dashboard';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  laptopOpened = true;
  screenPowered = true;
  hologramActive = true;
  profileVisible = true;
  terminalActive = false;
  dashboardActive = false;
  typedCommands: string[] = [];
  isTyping = false;
  displayName = 'ADITYA KESHRI';
  nameWords: { char: string }[][] = [];
  nameHovered = false;
  screenMode: ScreenMode = 'profile';
  tiltX = 0;
  tiltY = 0;
  glareX = 50;
  glareY = 40;
  clockLabel = '';

  readonly modes: { id: ScreenMode; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'terminal', label: 'Terminal', icon: 'code' },
    { id: 'dashboard', label: 'Stack', icon: 'grid_view' }
  ];

  terminalCommands = [
    'whoami',
    '→ Aditya Keshri · Senior Software Developer',
    'cat ~/stack.txt',
    '→ Angular · Python · Java · Node · Gen AI',
    'uptime --career',
    '→ 5+ years building production systems ✓'
  ];

  dashboardStats = [
    { label: 'Experience', value: '5+', unit: 'yrs' },
    { label: 'Projects', value: '20+', unit: 'shipped' },
    { label: 'Focus', value: 'Gen AI', unit: 'stack' },
    { label: 'Status', value: 'Open', unit: 'to roles' }
  ];

  mainTechs = [
    { icon: '🅰️', name: 'Angular' },
    { icon: '🐍', name: 'Python' },
    { icon: '☕︎', name: 'Java' },
    { icon: '🟢', name: 'Node.js' },
    { icon: '🐬', name: 'MySQL' },
    { icon: '🍃', name: 'MongoDB' },
    { icon: '☁️', name: 'AWS/Azure' },
  ];

  private typingTimeouts: ReturnType<typeof setTimeout>[] = [];
  private clockTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.nameWords = this.displayName
      .split(' ')
      .map(word => word.split('').map(char => ({ char })));

    this.tickClock();
    this.clockTimer = setInterval(() => this.tickClock(), 30_000);
    this.setMode('profile');
  }

  ngOnDestroy() {
    this.clearTypingTimers();
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  onNameEnter() {
    this.nameHovered = true;
  }

  onNameLeave() {
    this.nameHovered = false;
  }

  bounceLetter(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('letter-pop');
    void target.offsetWidth;
    target.classList.add('letter-pop');
  }

  async downloadResume() {
    const fallback = {
      fileId: '1raxpa3jaa_JEf7VWAvjxCilKqQwkw6v_',
      fileName: 'Aditya_Keshri_Resume.pdf'
    };

    try {
      const local = await this.loadResumeConfig(
        `assets/resume-config.json?t=${Date.now()}`
      );
      const config = local.remoteConfigUrl
        ? await this.loadResumeConfig(
            `${local.remoteConfigUrl}${local.remoteConfigUrl.includes('?') ? '&' : '?'}t=${Date.now()}`
          ).catch(() => local)
        : local;

      this.triggerResumeDownload(
        config.fileId || fallback.fileId,
        config.fileName || fallback.fileName
      );
    } catch {
      this.triggerResumeDownload(fallback.fileId, fallback.fileName);
    }
  }

  private async loadResumeConfig(url: string): Promise<{
    fileId?: string;
    fileName?: string;
    remoteConfigUrl?: string;
  }> {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Resume config HTTP ${response.status}`);
    }
    return response.json();
  }

  private triggerResumeDownload(fileId: string, fileName: string) {
    const link = document.createElement('a');
    link.href = `https://drive.google.com/uc?export=download&id=${fileId}`;
    link.download = fileName;
    link.rel = 'noopener';
    link.click();
  }

  scrollToContact() {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  onMonitorMove(event: MouseEvent) {
    if (!this.screenPowered) return;
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    this.tiltY = (px - 0.5) * 10;
    this.tiltX = (0.5 - py) * 8;
    this.glareX = px * 100;
    this.glareY = py * 100;
  }

  onMonitorLeave() {
    this.tiltX = 0;
    this.tiltY = 0;
    this.glareX = 50;
    this.glareY = 40;
  }

  onMonitorClick() {
    if (!this.screenPowered) return;
    const order: ScreenMode[] = ['profile', 'terminal', 'dashboard'];
    const next = order[(order.indexOf(this.screenMode) + 1) % order.length];
    this.setMode(next);
  }

  setMode(mode: ScreenMode, event?: Event) {
    event?.stopPropagation();
    if (!this.screenPowered) return;

    this.screenMode = mode;
    this.clearTypingTimers();
    this.typedCommands = [];
    this.isTyping = false;

    this.hologramActive = mode === 'profile';
    this.profileVisible = mode === 'profile';
    this.terminalActive = mode === 'terminal';
    this.dashboardActive = mode === 'dashboard';

    if (mode === 'terminal') {
      this.startTerminalTyping();
    }
  }

  togglePower(event: Event) {
    event.stopPropagation();
    this.screenPowered = !this.screenPowered;
    if (!this.screenPowered) {
      this.clearTypingTimers();
      this.isTyping = false;
      this.hologramActive = false;
      this.profileVisible = false;
      this.terminalActive = false;
      this.dashboardActive = false;
    } else {
      this.setMode(this.screenMode || 'profile');
    }
  }

  private tickClock() {
    this.clockLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private startTerminalTyping() {
    this.clearTypingTimers();
    this.typedCommands = [];
    this.isTyping = true;

    let delay = 0;
    this.terminalCommands.forEach((command, index) => {
      this.typedCommands.push('');
      for (let charIndex = 0; charIndex < command.length; charIndex++) {
        const timeout = setTimeout(() => {
          this.typedCommands[index] = command.slice(0, charIndex + 1);
        }, delay + charIndex * 22);
        this.typingTimeouts.push(timeout);
      }
      delay += command.length * 22 + 280;
    });

    const doneTimeout = setTimeout(() => {
      this.isTyping = false;
    }, delay);
    this.typingTimeouts.push(doneTimeout);
  }

  private clearTypingTimers() {
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts = [];
  }
}
