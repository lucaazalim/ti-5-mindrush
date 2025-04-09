import { createStore } from "zustand/vanilla";
import type { Match } from "~/lib/types";

export type MatchState = {
  match: Match;
  qrCodeBase64: string;
};

export type MatchActions = {
  setMatch: (match: Match) => void;
};

export type MatchStore = MatchState & MatchActions;

export const createMatchStore = (initState: MatchState) => {
  return createStore<MatchStore>()((set) => ({
    ...initState,
    setMatch: (match: Match) => set({ match }),
  }));
};
