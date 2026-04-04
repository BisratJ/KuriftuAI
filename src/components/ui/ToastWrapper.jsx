"use client";

import { ToastProvider } from "./Toast";

export function ToastWrapper({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
