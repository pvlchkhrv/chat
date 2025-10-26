import { Component, input } from '@angular/core';
import { AuthUser } from '../../shared/data-access/auth.service';
import { Message } from '../../shared/interfaces/message';

@Component({
  selector: 'app-message-list',
  template: `
    <ul class="gradient-bg">
      @for (message of messages(); track message.created) {
        <li
          [style.flex-direction]="
            message.author === activeUser()?.email ? 'row-reverse' : 'row'"
        >
          <div class="avatar animate-in-primary">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed={{
              message.author.split('@')[0]
            }}"
            />
          </div>
          <div class="message animate-in-secondary">
            <small>{{ message.author }}</small>
            <p>
              {{ message.content }}
            </p>
          </div>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      ul {
        height: 100%;
        overflow: scroll;
        list-style-type: none;
        padding: 1rem;
        padding-bottom: 5rem;
        margin: 0;
      }

      li {
        display: flex;
        margin-bottom: 2rem;
      }

      .avatar {
        width: 75px;
        margin: 0 1rem;
        height: auto;
        filter: drop-shadow(2px 3px 5px var(--accent-darker-color));
      }

      .message {
        width: 100%;
        background: var(--white);
        padding: 2rem;
        border-radius: 5px;
        filter: drop-shadow(2px 4px 3px var(--primary-darker-color));
      }
    `,
  ],
})
export class MessageList {
  readonly messages = input.required<Message[]>();
  readonly activeUser = input.required<AuthUser>();
}
