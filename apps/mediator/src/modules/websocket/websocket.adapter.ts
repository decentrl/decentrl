import { WsAdapter } from '@nestjs/platform-ws';
import { MessageMappingProperties } from '@nestjs/websockets';
import { EMPTY, Observable } from 'rxjs';

export class WebSocketAdapter extends WsAdapter {
  override bindMessageHandler(
    buffer: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>
  ): Observable<any> {
    try {
      const message = JSON.parse(buffer.data);
      const messageHandler = handlers.find(
        (handler) => handler.message === message.type
      );
      const { callback } = messageHandler;
      return transform(callback(message.data));
    } catch {
      return EMPTY;
    }
  }
}
