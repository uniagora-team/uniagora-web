import { getAccessToken } from "./api";

import type { Message } from "../types/chat";

interface IncomingWebSocketMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content_type: Message["content_type"];
  body: string;
  read_at: string | null;
  created_at: string;
}

interface ChatSocketOptions {
  conversationId: string;
  onMessage: (message: Message) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8000/api/v1";

const getWebSocketBaseUrl = (): string => {
  return API_BASE_URL
    .replace(/^http:/, "ws:")
    .replace(/^https:/, "wss:")
    .replace(/\/api\/v1\/?$/, "");
};

export class ChatSocket {
  private socket: WebSocket | null = null;

  private readonly conversationId: string;

  private readonly onMessage: (
    message: Message,
  ) => void;

  private readonly onOpen?: () => void;

  private readonly onClose?: () => void;

  private readonly onError?: () => void;

  constructor({
    conversationId,
    onMessage,
    onOpen,
    onClose,
    onError,
  }: ChatSocketOptions) {
    this.conversationId = conversationId;
    this.onMessage = onMessage;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
  }

  connect(): void {
    if (
      this.socket &&
      (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      )
    ) {
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      this.onError?.();
      return;
    }

    const socketUrl =
      `${getWebSocketBaseUrl()}/ws/chat/` +
      `${encodeURIComponent(this.conversationId)}/` +
      `?token=${encodeURIComponent(accessToken)}`;

    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      this.onOpen?.();
    };

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(
          event.data,
        ) as IncomingWebSocketMessage;

        if (
          !payload.id ||
          !payload.conversation_id ||
          !payload.sender_id
        ) {
          return;
        }

        const message: Message = {
          id: payload.id,
          conversation: payload.conversation_id,
          sender: payload.sender_id,
          content_type: payload.content_type,
          body: payload.body,
          read_at: payload.read_at,
          is_own: false,
          created_at: payload.created_at,
        };

        this.onMessage(message);
      } catch {
        this.onError?.();
      }
    };

    this.socket.onerror = () => {
      this.onError?.();
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.onClose?.();
    };
  }

  send(body: string): boolean {
    if (
      !this.socket ||
      this.socket.readyState !== WebSocket.OPEN
    ) {
      return false;
    }

    this.socket.send(
      JSON.stringify({
        body,
      }),
    );

    return true;
  }

  isConnected(): boolean {
    return (
      this.socket?.readyState === WebSocket.OPEN
    );
  }

  disconnect(): void {
    if (!this.socket) {
      return;
    }

    this.socket.close();
    this.socket = null;
  }
}