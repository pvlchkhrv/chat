import { Component, inject } from '@angular/core';
import { MessageService } from '../shared/data-access/message.service';
import { MessageList } from './ui/message-list';

@Component({
  selector: 'app-home',
  imports: [
    MessageList
  ],
  template: `
    <div class="container">
      <app-message-list [messages]="messageService.messages()" />
    </div>
  `,
  styles: ``,
})
export default class Home {
  readonly messageService = inject(MessageService);
}
