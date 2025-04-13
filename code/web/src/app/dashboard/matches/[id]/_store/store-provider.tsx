"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand/react";
import {
  createMatchStore,
  type MatchState,
  type MatchStore,
} from "~/app/dashboard/matches/[id]/_store/store";

export type MatchStoreApi = ReturnType<typeof createMatchStore>;

export const MatchStoreContext = createContext<MatchStoreApi | undefined>(
  undefined,
);

export type MatchStoreProviderProps = MatchState & {
  children: ReactNode;
};

export const MatchStoreProvider = ({
  children,
  ...props
}: MatchStoreProviderProps) => {
  const storeRef = useRef<MatchStoreApi>(undefined);

  if (!storeRef.current) {
    storeRef.current = createMatchStore(props);
  }

  return (
    <MatchStoreContext.Provider value={storeRef.current}>
      {children}
    </MatchStoreContext.Provider>
  );
};

export const useMatchStore = <T,>(selector: (state: MatchStore) => T): T => {
  const storeContext = useContext(MatchStoreContext);

  if (!storeContext) {
    throw new Error("useMatchStore must be used within a MatchStoreProvider.");
  }

  return useStore(storeContext, selector);
};
