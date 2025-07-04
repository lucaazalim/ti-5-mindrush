import { Channel } from "pusher-js";
import { createStore } from "zustand/vanilla";
import type { Participant, PopulatedMatch } from "~/lib/types";

export type MatchState = {
  match: PopulatedMatch;
  channel?: Channel;
  qrCodeBase64: string;
  timeLeft: number | undefined;
};

export type MatchActions = {
  setMatch: (match: PopulatedMatch) => void;
  setChannel: (channel: Channel | undefined) => void;
  addParticipant: (participant: Participant) => void;
  setTimeLeft: (timeLeft: number) => void;
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
    setTimeLeft: (timeLeft: number) => set({ timeLeft: timeLeft }),
  }));
};
