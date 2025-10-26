import { Component, effect, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../shared/data-access/auth.service';
import MessageService from '../shared/data-access/message.service';
import { MessageInputComponent } from './ui/message-input';
import { MessageList } from './ui/message-list';

@Component({
  selector: 'app-home',
  imports: [
    MessageList,
    MessageInputComponent,
    MatToolbar,
    MatIcon
  ],
  template: `
    <div class="container">
      <mat-toolbar color="primary">
        <span class="spacer"></span>
        <button mat-icon-button (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <app-message-list [activeUser]="authService.user()" [messages]="messageService.messages()"/>
      <app-message-input (send)="messageService.add$.next($event)"/>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }

      mat-toolbar {
        box-shadow: 0px -7px 11px 0px var(--accent-color);
      }

      app-message-list {
        height: 100%;
        width: 100%;
      }

      app-message-input {
        position: fixed;
        bottom: 0;
      }
    `,
  ],
})
export default class Home {
  readonly messageService = inject(MessageService);
  readonly authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }
}
