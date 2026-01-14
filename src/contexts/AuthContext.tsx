import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple localStorage-based auth (for demo purposes)
    // In production, this would call a backend API
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userKey = `user_${email}`;
    const userData = users[userKey];

    if (userData && userData.password === password) {
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simple localStorage-based auth (for demo purposes)
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userKey = `user_${email}`;

    if (users[userKey]) {
      return false; // User already exists
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
    };

    users[userKey] = {
      ...newUser,
      password, // In production, this should be hashed
    };

    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
