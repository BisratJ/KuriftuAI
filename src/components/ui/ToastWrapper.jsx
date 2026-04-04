"use client";

import { ToastProvider } from "./Toast";
import { ConfigProvider } from "@/lib/config";

export function ToastWrapper({ children }) {
  return (
    <ConfigProvider>
      <ToastProvider>{children}</ToastProvider>
    </ConfigProvider>
  );
}
