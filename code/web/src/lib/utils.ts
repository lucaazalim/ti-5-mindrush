import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(nickname: string) {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${nickname}`;
}
