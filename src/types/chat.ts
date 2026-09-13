export type TransactionStatus =
  | "ONGOING"
  | "COMPLETED";

export type MessageType =
  | "TEXT"
  | "IMAGE";

export interface Conversation {
  id: string;
  customer: string;
  vendor: string;
  vendor_store_name: string;
  product: string | null;
  product_name: string | null;
  transaction_status: TransactionStatus;
  completed_at: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation: string;
  sender: string;
  content_type: MessageType;
  body: string;
  read_at: string | null;
  is_own: boolean;
  created_at: string;
}

export interface CreateConversationPayload {
  vendor: string;
  product?: string | null;
}

export interface SendMessagePayload {
  content_type: MessageType;
  body: string;
}