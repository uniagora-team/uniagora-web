import api from "./api";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginationResponse,
} from "../types/api";
import type {
  Conversation,
  CreateConversationPayload,
  Message,
  SendMessagePayload,
} from "../types/chat";

const CONVERSATIONS_ENDPOINT = "/conversations";

const isSuccessResponse = <T>(
  response: ApiSuccessResponse<T> | ApiErrorResponse,
): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

const getResponseData = <T>(
  response: ApiSuccessResponse<T> | ApiErrorResponse,
): T => {
  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Request failed.");
  }

  return response.data;
};

export const chatService = {
  async createConversation(
    payload: CreateConversationPayload,
  ): Promise<Conversation> {
    const response = await api.post<
      ApiSuccessResponse<Conversation> | ApiErrorResponse
    >(`${CONVERSATIONS_ENDPOINT}/`, payload);

    return getResponseData(response.data);
  },

  async getConversations(): Promise<PaginationResponse<Conversation>> {
    const response = await api.get<
      ApiSuccessResponse<PaginationResponse<Conversation>> | ApiErrorResponse
    >(`${CONVERSATIONS_ENDPOINT}/`);

    return getResponseData(response.data);
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await api.get<
      ApiSuccessResponse<Conversation> | ApiErrorResponse
    >(`${CONVERSATIONS_ENDPOINT}/${id}/`);

    return getResponseData(response.data);
  },

  async getMessages(id: string): Promise<PaginationResponse<Message>> {
    const response = await api.get<
      ApiSuccessResponse<PaginationResponse<Message>> | ApiErrorResponse
    >(`${CONVERSATIONS_ENDPOINT}/${id}/messages/`);

    return getResponseData(response.data);
  },

  async sendMessage(
    id: string,
    payload: SendMessagePayload,
  ): Promise<Message> {
    const response = await api.post<
      ApiSuccessResponse<Message> | ApiErrorResponse
    >(`${CONVERSATIONS_ENDPOINT}/${id}/messages/`, payload);

    return getResponseData(response.data);
  },

  async markAsRead(id: string): Promise<void> {
    const response = await api.post<
      ApiSuccessResponse<unknown> | ApiErrorResponse
    >(`${CONVERSATIONS_ENDPOINT}/${id}/read/`);

    getResponseData(response.data);
  },

  async completeConversation(id: string): Promise<Conversation> {
    const response = await api.post<
      ApiSuccessResponse<Conversation> | ApiErrorResponse
    >(`${CONVERSATIONS_ENDPOINT}/${id}/complete/`);

    return getResponseData(response.data);
  },
};