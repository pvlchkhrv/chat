import { computed, inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, limit, orderBy, query } from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import { collectionData } from 'rxfire/firestore';
import { catchError, defer, exhaustMap, filter, merge, Observable, of, retry, Subject, } from 'rxjs';
import { ignoreElements, map } from 'rxjs/operators';
import { FIRESTORE } from '../../app.config';

import { Message } from '../interfaces/message';
import { AuthService } from './auth.service';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
class MessageService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  // sources
  messages$ = this.getMessages().pipe(
    // restart stream when user reauthenticates
    retry({
      delay: () => this.authUser$.pipe(filter((user) => !!user)),
    })
  );
  add$ = new Subject<Message['content']>();

  // state
  private state = signal<MessageState>({
    messages: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);
  private authUser$: any;

  constructor() {
    // reducers
    const nextState$ = merge(
      this.messages$.pipe(map((messages) => ({ messages }))),
      this.add$.pipe(
        exhaustMap(message => this.addMessage(message)),
        ignoreElements(),
        catchError(error => of(({ error })))
      )
    );

    connect(this.state).with(nextState$);
  }

  private getMessages() {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse())
    ) as Observable<Message[]>;
  }

  private addMessage(message: string) {
    const newMessage: Message = {
      author: this.authService.user()?.email!,
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}

export default MessageService
