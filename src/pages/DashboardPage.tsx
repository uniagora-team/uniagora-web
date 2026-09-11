import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="container py-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 fw-bold">
            Welcome, {user?.full_name || "User"}
          </h1>

          <p className="text-muted mb-4">
            Your UniAGORA dashboard will be built here.
          </p>

          <button
            type="button"
            className="btn btn-dark"
            onClick={() => void logout()}
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}