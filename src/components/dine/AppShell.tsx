import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { FloatingCart } from "./FloatingCart";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md bg-background pb-28">
      {children}
      <FloatingCart />
      {!hideNav && <BottomNav />}
    </div>
  );
}
