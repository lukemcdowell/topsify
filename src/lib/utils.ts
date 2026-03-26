import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but was not provided.`,
    );
  }
  return value;
}

const shimmer = (w: number, h: number) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#27272a"/></svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const blurPlaceholder = (w = 64, h = 64) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
