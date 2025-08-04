import React, { createContext, useCallback, useState } from "react";
import { User } from "../types";

export const UserContext = createContext<{
  user: User | null;
  updateUser: (user: User | null) => void;
  clearUser: () => void;
}>({
  user: null,
  updateUser: () => {},
  clearUser: () => {},
});

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = useCallback((userData: User | null) => {
    setUser(userData);
  }, []);

  const clearUser = useCallback(() => setUser(null), []);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
