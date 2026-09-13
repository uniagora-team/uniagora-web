import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { chatService } from "../services/chat.service";
import { getApiErrorMessage } from "../services/api";

import type { Conversation } from "../types/chat";

const formatConversationTime = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return new Intl.DateTimeFormat("en-NG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() === now.getFullYear()
        ? undefined
        : "numeric",
  }).format(date);
};

export default function ConversationsPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadConversations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await chatService.getConversations();

        if (!isMounted) {
          return;
        }

        setConversations(response.results);
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

    void loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenConversation = (
    conversationId: string,
  ) => {
    navigate(`/chat/${conversationId}`);
  };

  return (
    <main className="min-vh-100 bg-light">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2">
          <Link
            to="/dashboard"
            className="navbar-brand fw-bold text-dark text-decoration-none"
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
            <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
              <div>
                <p className="small text-muted mb-1">
                  Your conversations
                </p>

                <h1 className="h3 fw-bold mb-1">
                  Messages
                </h1>

                <p className="text-muted mb-0">
                  Chat with sellers about products you're
                  interested in.
                </p>
              </div>

              <Link
                to="/dashboard"
                className="btn btn-primary d-none d-sm-inline-block"
              >
                Browse products
              </Link>
            </div>

            {isLoading && (
              <div
                className="card border-0 shadow-sm"
                aria-live="polite"
              >
                <div className="card-body p-4">
                  <div className="d-flex flex-column gap-3">
                    {Array.from({ length: 3 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="placeholder-glow border rounded-3 p-3"
                        >
                          <div className="placeholder col-6 mb-2" />
                          <div className="placeholder col-8 mb-2" />
                          <div className="placeholder col-3" />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isLoading && error && (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-5">
                  <div
                    className="rounded-circle bg-light border d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "64px",
                      height: "64px",
                    }}
                  >
                    <span
                      className="fw-bold text-muted"
                      aria-hidden="true"
                    >
                      !
                    </span>
                  </div>

                  <h2 className="h5 fw-bold mb-2">
                    Unable to load messages
                  </h2>

                  <p className="text-muted mb-4">
                    {error}
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {!isLoading &&
              !error &&
              conversations.length === 0 && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center p-5">
                    <div
                      className="rounded-circle bg-light border d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "72px",
                        height: "72px",
                      }}
                    >
                      <span
                        className="fw-bold text-muted"
                        aria-hidden="true"
                      >
                        💬
                      </span>
                    </div>

                    <h2 className="h5 fw-bold mb-2">
                      No conversations yet
                    </h2>

                    <p className="text-muted mb-4">
                      When you contact a seller about a
                      product, your conversation will appear
                      here.
                    </p>

                    <Link
                      to="/dashboard"
                      className="btn btn-primary"
                    >
                      Browse products
                    </Link>
                  </div>
                </div>
              )}

            {!isLoading &&
              !error &&
              conversations.length > 0 && (
                <div className="card border-0 shadow-sm overflow-hidden">
                  <div className="list-group list-group-flush">
                    {conversations.map(
                      (conversation) => {
                        const hasUnread =
                          conversation.unread_count > 0;

                        const isCompleted =
                          conversation.transaction_status ===
                          "COMPLETED";

                        return (
                          <button
                            key={conversation.id}
                            type="button"
                            className="list-group-item list-group-item-action text-start p-3 p-md-4"
                            onClick={() =>
                              handleOpenConversation(
                                conversation.id,
                              )
                            }
                          >
                            <div className="d-flex align-items-start gap-3">
                              <div
                                className="rounded-circle bg-light border d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                }}
                                aria-hidden="true"
                              >
                                <span className="fw-bold text-dark">
                                  {conversation.vendor_store_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>

                              <div className="flex-grow-1 min-w-0">
                                <div className="d-flex align-items-start justify-content-between gap-3">
                                  <div className="min-w-0">
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                      <h2 className="h6 fw-bold mb-0 text-dark text-truncate">
                                        {
                                          conversation.vendor_store_name
                                        }
                                      </h2>

                                      {hasUnread && (
                                        <span className="badge rounded-pill bg-primary">
                                          {
                                            conversation.unread_count
                                          }
                                        </span>
                                      )}
                                    </div>

                                    <p className="small text-muted mb-1 mt-1">
                                      {
                                        conversation.product_name
                                      }
                                    </p>
                                  </div>

                                  <span className="small text-muted flex-shrink-0">
                                    {formatConversationTime(
                                      conversation.updated_at,
                                    )}
                                  </span>
                                </div>

                                <div className="d-flex align-items-center justify-content-between gap-3 mt-2">
                                  <span
                                    className={`badge ${
                                      isCompleted
                                        ? "bg-secondary"
                                        : "bg-success"
                                    }`}
                                  >
                                    {isCompleted
                                      ? "Completed"
                                      : "Ongoing"}
                                  </span>

                                  <span className="small text-muted">
                                    Open conversation →
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

            <div className="d-sm-none mt-3">
              <Link
                to="/dashboard"
                className="btn btn-primary w-100"
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}