import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstallPromptComponent } from './install-prompt/install-prompt';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InstallPromptComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pukka-calendar');
}
