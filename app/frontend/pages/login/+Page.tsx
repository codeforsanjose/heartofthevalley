import { useId, useState } from "react";

export default function LoginPage() {
  const emailId = useId();
  const passwordId = useId();
  const rememberMeId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // TODO: Implement actual authentication logic
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.location.href = "/admin";
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block mb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-grenadier">HEART OF THE VALLEY</h1>
            <p className="text-gray-600 mt-1">Admin Login</p>
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Sign In to Admin Dashboard</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={emailId}>
                Email Address
              </label>
              <input
                type="email"
                id={emailId}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-gray-50 border border-gray-300 p-3 focus:border-grenadier focus:outline-none focus:ring-2 focus:ring-grenadier focus:ring-opacity-20 transition-colors"
                placeholder="admin@heartofthevalley.org"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={passwordId}>
                Password
              </label>
              <input
                type="password"
                id={passwordId}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-gray-50 border border-gray-300 p-3 focus:border-grenadier focus:outline-none focus:ring-2 focus:ring-grenadier focus:ring-opacity-20 transition-colors"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={rememberMeId}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-grenadier focus:ring-grenadier border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor={rememberMeId} className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <a href="/forgot-password" className="text-sm text-grenadier hover:text-opacity-80 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-grenadier hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-grenadier focus:ring-opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-grenadier transition-colors">
              ← Back to Heart of the Valley
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
