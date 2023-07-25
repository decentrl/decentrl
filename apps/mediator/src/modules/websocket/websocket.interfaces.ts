import { WebSocket } from 'ws';

export interface WebSocketExtended extends WebSocket {
  id: string;
  pingIntervalTimer: NodeJS.Timer;
  pingTimeoutTimer: NodeJS.Timer;
  did?: string;
}
