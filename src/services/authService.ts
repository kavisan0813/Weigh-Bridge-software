export interface UserSession {
  user: string;
  role: "admin" | "operator";
  weighbridge?: string;
  isAuthenticated: boolean;
}

export interface AuthResult {
  success: boolean;
  session?: UserSession;
  error?: string;
}

const SESSION_STORAGE_KEY = "wb_auth_session";

export const authService = {
  /**
   * Authenticates user against demo credentials
   */
  authenticate: async (
    usernameInput: string,
    passwordInput: string,
    selectedWeighbridge: string = "WB-01",
  ): Promise<AuthResult> => {
    // Simulate slight network latency for realistic loading state
    await new Promise((resolve) => setTimeout(resolve, 600));

    const username = usernameInput.trim();
    const password = passwordInput.trim();

    if (!username) {
      return { success: false, error: "Enter your username." };
    }

    if (!password) {
      return { success: false, error: "Enter your password." };
    }

    // Admin Credential Check
    if (
      (username.toLowerCase() === "admin" ||
        username.toLowerCase() === "arun") &&
      password === "Admin@123"
    ) {
      const session: UserSession = {
        user: "Rithick Nathan",
        role: "admin",
        isAuthenticated: true,
      };
      authService.saveSession(session);
      return { success: true, session };
    }

    // Operator Credential Check
    if (
      (username.toLowerCase() === "operator" ||
        username.toLowerCase() === "emp-0012" ||
        username.toLowerCase() === "ravi") &&
      password === "Operator@123"
    ) {
      const session: UserSession = {
        user: "Ravi Kumar",
        role: "operator",
        weighbridge: selectedWeighbridge || "WB-01",
        isAuthenticated: true,
      };
      authService.saveSession(session);
      return { success: true, session };
    }

    // Generic error for invalid credentials
    return {
      success: false,
      error: "Invalid username or password.",
    };
  },

  /**
   * Retrieve active session from localStorage
   */
  getSession: (): UserSession | null => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as UserSession;
      if (
        parsed &&
        parsed.isAuthenticated &&
        (parsed.role === "admin" || parsed.role === "operator")
      ) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Save session to localStorage
   */
  saveSession: (session: UserSession): void => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage write errors
    }
  },

  /**
   * Clear session on logout
   */
  clearSession: (): void => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage remove errors
    }
  },
};
