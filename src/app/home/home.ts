import { Component, inject } from '@angular/core';
import { MessageService } from '../shared/data-access/message.service';
import { MessageInputComponent } from './ui/message-input';
import { MessageList } from './ui/message-list';

@Component({
  selector: 'app-home',
  imports: [
    MessageList,
    MessageInputComponent
  ],
  template: `
    <div class="container">
      <app-message-list [messages]="messageService.messages()" />
      <app-message-input (send)="messageService.add$.next($event)" />
    </div>
  `,
  styles: ``,
})
export default class Home {
  readonly messageService = inject(MessageService);
}
