import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { chatService } from "../services/chat.service";
import { getApiErrorMessage } from "../services/api";
import { ChatSocket } from "../services/chat.socket";

import type {
  Conversation,
  Message,
} from "../types/chat";

const formatMessageTime = (
  value: string,
): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export default function ChatPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const { user } = useAuth();

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [messageInput, setMessageInput] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSending, setIsSending] =
    useState(false);

  const [isSocketConnected, setIsSocketConnected] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [sendError, setSendError] =
    useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const socketRef =
    useRef<ChatSocket | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true;

    const loadChat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          conversationData,
          messagesData,
        ] = await Promise.all([
          chatService.getConversation(id),
          chatService.getMessages(id),
        ]);

        if (!isMounted) {
          return;
        }

        setConversation(conversationData);
        setMessages(messagesData.results);

        await chatService.markAsRead(id);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          getApiErrorMessage(requestError),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadChat();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !user) {
      return;
    }

    const socket = new ChatSocket({
      conversationId: id,

      onOpen: () => {
        setIsSocketConnected(true);
      },

      onClose: () => {
        setIsSocketConnected(false);
      },

      onError: () => {
        setIsSocketConnected(false);
      },

      onMessage: (incomingMessage) => {
        const message: Message = {
          ...incomingMessage,
          is_own:
            incomingMessage.sender === user.id,
        };

        setMessages((currentMessages) => {
          const existingMessage =
            currentMessages.find(
              (currentMessage) =>
                currentMessage.id === message.id,
            );

          if (existingMessage) {
            if (
              existingMessage.read_at !==
              message.read_at
            ) {
              return currentMessages.map(
                (currentMessage) =>
                  currentMessage.id === message.id
                    ? {
                        ...currentMessage,
                        read_at:
                          message.read_at,
                      }
                    : currentMessage,
              );
            }

            return currentMessages;
          }

          return [
            ...currentMessages,
            message,
          ];
        });

        void chatService.markAsRead(id);
      },
    });

    socketRef.current = socket;

    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsSocketConnected(false);
    };
  }, [id, user]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true;

    const syncReadReceipts = async () => {
      try {
        const messagesData =
          await chatService.getMessages(id);

        if (!isMounted) {
          return;
        }

        const latestMessages =
          messagesData.results;

        setMessages((currentMessages) => {
          let hasChanges = false;

          const updatedMessages =
            currentMessages.map(
              (currentMessage) => {
                const latestMessage =
                  latestMessages.find(
                    (message) =>
                      message.id ===
                      currentMessage.id,
                  );

                if (
                  !latestMessage ||
                  latestMessage.read_at ===
                    currentMessage.read_at
                ) {
                  return currentMessage;
                }

                hasChanges = true;

                return {
                  ...currentMessage,
                  read_at:
                    latestMessage.read_at,
                };
              },
            );

          return hasChanges
            ? updatedMessages
            : currentMessages;
        });
      } catch {
        // Read-receipt polling is non-critical.
        // The existing chat remains usable if it fails.
      }
    };

    const intervalId = window.setInterval(
      () => {
        void syncReadReceipts();
      },
      3000,
    );

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    const body = messageInput.trim();

    if (!body || isSending) {
      return;
    }

    try {
      setIsSending(true);
      setSendError(null);

      const socketSent =
        socketRef.current?.send(body) ?? false;

      if (!socketSent) {
        const message =
          await chatService.sendMessage(id, {
            content_type: "TEXT",
            body,
          });

        setMessages((currentMessages) => {
          const alreadyExists =
            currentMessages.some(
              (currentMessage) =>
                currentMessage.id ===
                message.id,
            );

          if (alreadyExists) {
            return currentMessages;
          }

          return [
            ...currentMessages,
            message,
          ];
        });
      }

      setMessageInput("");
    } catch (requestError) {
      setSendError(
        getApiErrorMessage(requestError),
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!id) {
    return (
      <main className="min-vh-100 bg-light">
        <nav className="navbar bg-white border-bottom">
          <div className="container py-2">
            <Link
              to="/dashboard"
              className="navbar-brand fw-bold"
            >
              UniAGORA
            </Link>
          </div>
        </nav>

        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-7 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-5">
                  <h1 className="h4 fw-bold mb-3">
                    Unable to open chat
                  </h1>

                  <p className="text-muted mb-4">
                    Invalid conversation.
                  </p>

                  <Link
                    to="/dashboard"
                    className="btn btn-primary"
                  >
                    Back to marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-vh-100 bg-light">
        <nav className="navbar bg-white border-bottom">
          <div className="container py-2">
            <Link
              to="/dashboard"
              className="navbar-brand fw-bold"
            >
              UniAGORA
            </Link>
          </div>
        </nav>

        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                    aria-label="Loading conversation"
                  />

                  <p className="text-muted mb-0">
                    Loading conversation...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !conversation) {
    return (
      <main className="min-vh-100 bg-light">
        <nav className="navbar bg-white border-bottom">
          <div className="container py-2">
            <Link
              to="/dashboard"
              className="navbar-brand fw-bold"
            >
              UniAGORA
            </Link>
          </div>
        </nav>

        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-7 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-5">
                  <h1 className="h4 fw-bold mb-3">
                    Unable to open chat
                  </h1>

                  <p className="text-muted mb-4">
                    {error ??
                      "This conversation could not be found."}
                  </p>

                  <Link
                    to="/dashboard"
                    className="btn btn-primary"
                  >
                    Back to marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const isCompleted =
    conversation.transaction_status ===
    "COMPLETED";

  return (
    <main className="min-vh-100 bg-light">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2">
          <Link
            to="/dashboard"
            className="navbar-brand fw-bold"
          >
            UniAGORA
          </Link>

          <Link
            to="/dashboard"
            className="btn btn-outline-dark btn-sm"
          >
            Marketplace
          </Link>
        </div>
      </nav>

      <section className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="card-header bg-white border-bottom p-3 p-md-4">
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to="/dashboard"
                      className="small text-muted text-decoration-none"
                    >
                      ← Back to marketplace
                    </Link>

                    <h1 className="h5 fw-bold mb-1 mt-2 text-truncate">
                      {conversation.vendor_store_name}
                    </h1>

                    <p className="small text-muted mb-0">
                      About:{" "}
                      {conversation.product_name}
                    </p>
                  </div>

                  <div className="text-end flex-shrink-0">
                    <span
                      className={`badge ${
                        isCompleted
                          ? "text-bg-secondary"
                          : "text-bg-success"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : "Active"}
                    </span>

                    {!isCompleted && (
                      <div className="small text-success mt-1">
                        <span
                          className="d-inline-block rounded-circle bg-success me-1"
                          style={{
                            width: "6px",
                            height: "6px",
                          }}
                          aria-hidden="true"
                        />
                        {isSocketConnected
                          ? "Live"
                          : "Connecting..."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="bg-light px-3 px-md-4 py-4"
                style={{
                  minHeight: "420px",
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                {messages.length === 0 ? (
                  <div className="h-100 d-flex align-items-center justify-content-center">
                    <div className="text-center py-5">
                      <div
                        className="rounded-circle bg-white shadow-sm d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "64px",
                          height: "64px",
                        }}
                      >
                        <span
                          className="fw-bold text-muted"
                          aria-hidden="true"
                        >
                          💬
                        </span>
                      </div>

                      <h2 className="h6 fw-bold mb-2">
                        Start the conversation
                      </h2>

                      <p className="small text-muted mb-0">
                        Send a message to the seller
                        about this product.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {messages.map((message) => {
                      const isOwn =
                        message.is_own;

                      const isRead =
                        isOwn &&
                        Boolean(message.read_at);

                      return (
                        <div
                          key={message.id}
                          className={`d-flex ${
                            isOwn
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
                          <div
                            className={`rounded-4 px-3 py-2 ${
                              isOwn
                                ? "bg-primary text-white"
                                : "bg-white border"
                            }`}
                            style={{
                              maxWidth: "80%",
                            }}
                          >
                            <p className="mb-1 text-break">
                              {message.body}
                            </p>

                            <div
                              className={`small d-flex align-items-center justify-content-end gap-1 ${
                                isOwn
                                  ? "text-white-50"
                                  : "text-muted"
                              }`}
                            >
                              <span>
                                {formatMessageTime(
                                  message.created_at,
                                )}
                              </span>

                              {isOwn && (
                                <span
                                  className={
                                    isRead
                                      ? "text-info fw-bold"
                                      : "text-white-50"
                                  }
                                  aria-label={
                                    isRead
                                      ? "Read"
                                      : "Sent"
                                  }
                                  title={
                                    isRead
                                      ? "Read"
                                      : "Sent"
                                  }
                                  style={{
                                    fontSize:
                                      "0.85rem",
                                    letterSpacing:
                                      "-2px",
                                  }}
                                >
                                  {isRead
                                    ? "✓✓"
                                    : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="card-footer bg-white border-top p-3 p-md-4">
                {sendError && (
                  <div
                    className="alert alert-danger py-2 small"
                    role="alert"
                  >
                    {sendError}
                  </div>
                )}

                {isCompleted ? (
                  <div className="alert alert-secondary mb-0">
                    <div className="fw-semibold mb-1">
                      Conversation completed
                    </div>

                    <div className="small">
                      This transaction has been marked
                      as completed.
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="d-flex gap-2"
                  >
                    <label
                      htmlFor="chat-message"
                      className="visually-hidden"
                    >
                      Message
                    </label>

                    <input
                      id="chat-message"
                      type="text"
                      className="form-control"
                      value={messageInput}
                      onChange={(event) =>
                        setMessageInput(
                          event.target.value,
                        )
                      }
                      placeholder="Write a message..."
                      disabled={isSending}
                      autoComplete="off"
                    />

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={
                        isSending ||
                        messageInput.trim()
                          .length === 0
                      }
                    >
                      {isSending ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Sending
                        </>
                      ) : (
                        "Send"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}