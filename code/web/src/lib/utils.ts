import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Participant } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(participant: Participant) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${participant.id}`;
}
