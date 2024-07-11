import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

interface UserContextType {
  user: User | null;
  handleLoginWithGoogle: () => void;
  handleLoginWithEmail: (email: string, password: string) => void;
  handleLogout: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => console.error("Error signing in with Google:", error));
  };

  const handleLoginWithEmail = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setUser(result.user);
        window.location.href = "/";
      })
      .catch((error) => console.error("Error signing in with email:", error));
  };
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        handleLoginWithGoogle,
        handleLoginWithEmail,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
