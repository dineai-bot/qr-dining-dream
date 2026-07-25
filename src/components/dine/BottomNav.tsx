import { Link, useRouterState } from "@tanstack/react-router";
import { Home, UtensilsCrossed, Sparkles, Receipt, User } from "lucide-react";

type NavItem = { to: "/home" | "/menu" | "/concierge" | "/track" | "/profile"; label: string; icon: typeof Home; primary?: boolean };
const items: NavItem[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/concierge", label: "AI", icon: Sparkles, primary: true },
  { to: "/track", label: "Orders", icon: Receipt },
  { to: "/profile", label: "You", icon: User },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="glass flex items-center justify-around rounded-full px-2 py-2 shadow-elevated">
          {items.map(({ to, label, icon: Icon, primary }) => {
            const active = path === to || (to !== "/home" && path.startsWith(to));
            if (primary) {
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-gold transition-transform hover:scale-105 active:scale-95"
                  style={{ background: "var(--gradient-gold)" }}
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              );
            }
            return (
              <Link
                key={to}
                to={to}
                className={`flex min-w-14 flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
