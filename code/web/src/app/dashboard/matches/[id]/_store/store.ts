import { Channel } from "pusher-js";
import { createStore } from "zustand/vanilla";
import type { Participant, PopulatedMatch } from "~/lib/types";

export type MatchState = {
  match: PopulatedMatch;
  channel: Channel | undefined;
  qrCodeBase64: string;
};

export type MatchActions = {
  setMatch: (match: PopulatedMatch) => void;
  setChannel: (channel: Channel | undefined) => void;
  addParticipant: (participant: Participant) => void;
};

export type MatchStore = MatchState & MatchActions;

export const createMatchStore = (initState: MatchState) => {
  return createStore<MatchStore>()((set) => ({
    ...initState,
    setMatch: (match: PopulatedMatch) => set({ match }),
    setChannel: (channel: Channel | undefined) => set({ channel }),
    addParticipant: (participant: Participant) =>
      set((state) => ({
        match: {
          ...state.match,
          participants: [...state.match.participants, participant],
        },
      })),
  }));
};
