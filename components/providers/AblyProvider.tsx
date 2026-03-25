"use client";

import React, { createContext, useContext, useMemo } from "react";
import * as Ably from "ably";

const AblyContext = createContext<Ably.Realtime | null>(null);

export const AblyProvider = ({ children }: { children: React.ReactNode }) => {
  // Connection is created once and persists as long as the user is in the /chats layout
  const ably = useMemo(() => {
    return new Ably.Realtime({ authUrl: "/api/ably" });
  }, []);

  return (
    <AblyContext.Provider value={ably}>
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = () => {
  const context = useContext(AblyContext);
  if (!context) throw new Error("useAbly must be used within an AblyProvider");
  return context;
};