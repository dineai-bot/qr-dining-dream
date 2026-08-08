import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { ConciergeOrb } from "@/components/dine/ConciergeOrb";
import { ArrowLeft, ChevronUp, Clock3, Flame, Keyboard, Mic, Plus, Send, Star, X } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { dishes } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { speak, stopSpeaking, useSpeech } from "@/lib/useSpeech";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/concierge")({
  component: Concierge,
  head: () => ({
    meta: [
      { title: "Aria, your AI Concierge — DineAI" },
      { name: "description", content: "Hold to talk with Aria, the DineAI voice concierge, for pairings, recommendations, and dietary guidance at your table." },
      { property: "og:title", content: "Aria — your table's AI concierge" },
      { property: "og:description", content: "Hold the orb, speak, and let Aria guide your evening." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Msg = { id: string; role: "ai" | "user"; text: string; cards?: string[] };

const prompts = [
  "Something light and vegetarian",
  "Pair the wagyu with a drink",
  "Nut-free desserts?",
  "What's the chef proud of tonight?",
];

const scripted: Record<string, { text: string; cards?: string[] }> = {
  default: {
    text: "Two thoughts: our black truffle tagliolini if you're in the mood for something quiet, or the wagyu if you'd like the room to notice. Either way, I'd start with the burrata.",
    cards: ["truffle-pasta", "wagyu-steak", "burrata"],
  },
  vegetarian: {
    text: "For something light and green — the heirloom burrata, then the tagliolini. Both meatless. Both memorable.",
    cards: ["burrata", "truffle-pasta"],
  },
  pair: {
    text: "The wagyu pairs beautifully with our smoked negroni — the applewood echoes the char. Shall I add one?",
    cards: ["smoke-negroni"],
  },
  dessert: {
    text: "The molten chocolate is nut-free tonight. Rich, but the vanilla balances it.",
    cards: ["lava"],
  },
  chef: {
    text: "Chef Anaïs is quietly proud of the tagliolini — she rolled the pasta this morning. It's her mother's recipe.",
    cards: ["truffle-pasta"],
  },
};

function reply(text: string) {
  const t = text.toLowerCase();
  return t.includes("veg") ? scripted.vegetarian
    : t.includes("pair") || t.includes("drink") || t.includes("wine") || t.includes("wagyu") ? scripted.pair
    : t.includes("dessert") || t.includes("nut") ? scripted.dessert
    : t.includes("chef") || t.includes("proud") || t.includes("special") ? scripted.chef
    : scripted.default;
}

/** Reveals Aria's words as she says them. */
function StreamedText({ text, onDone, className }: { text: string; onDone?: () => void; className?: string }) {
  const words = text.split(" ");
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let i = 0;
    setCount(0);
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= words.length) { clearInterval(id); doneRef.current?.(); }
    }, 55);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <p className={className}>
      {words.slice(0, count).join(" ")}
      {count < words.length && (
        <span className="ml-1 inline-block h-[0.75em] w-[2px] translate-y-[1px] rounded-full bg-gold align-middle" style={{ animation: "orb-breathe 1s ease-in-out infinite" }} />
      )}
    </p>
  );
}

function DishSuggestion({ id, delay, compact = false }: { id: string; delay: number; compact?: boolean }) {
  const { add } = useCart();
  const d = dishes.find((x) => x.id === id);
  if (!d) return null;
  return (
    <div
      className="fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-soft"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <img src={d.image} alt={d.name} className={cn("rounded-xl object-cover", compact ? "h-12 w-12" : "h-14 w-14")} loading="lazy" />
        <span className="absolute -bottom-1 -right-1 rounded-full bg-card px-1.5 py-0.5 text-[10px] font-medium shadow-soft">
          <Star className="mr-0.5 inline h-2.5 w-2.5 fill-gold text-gold" />
          {d.rating}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-sm leading-tight">{d.name}</div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{d.prepMins}m</span>
          {d.spice > 0 && <span className="inline-flex items-center gap-0.5 text-ember"><Flame className="h-3 w-3" />{"·".repeat(d.spice)}</span>}
          <span className="text-foreground">${d.price}</span>
        </div>
      </div>
      <button
        onClick={() => { add(d.id); toast.success(`Added ${d.name}`); }}
        className="flex h-9 items-center gap-1 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}

type Mode = "idle" | "listening" | "thinking" | "speaking";

function Concierge() {
  const router = useRouter();
  const speech = useSpeech();
  const [mode, setMode] = useState<Mode>("idle");
  const [cancelArmed, setCancelArmed] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [live, setLive] = useState("");
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [sheet, setSheet] = useState(false);
  const holdStart = useRef<{ y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastAi = [...messages].reverse().find((m) => m.role === "ai");

  useEffect(() => { if (typing) inputRef.current?.focus(); }, [typing]);
  useEffect(() => () => stopSpeaking(), []);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    stopSpeaking();
    setLive("");
    setDraft("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: q }]);
    setMode("thinking");
    setTimeout(() => {
      const r = reply(q);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: r.text, cards: r.cards }]);
      setMode("speaking");
      speak(r.text);
    }, 900);
  };

  const beginHold = (y: number) => {
    if (mode === "thinking") return;
    stopSpeaking();
    holdStart.current = { y };
    setCancelArmed(false);
    setLive("");
    setMode("listening");
    speech.start();
  };

  const moveHold = (y: number) => {
    if (mode !== "listening" || !holdStart.current) return;
    setCancelArmed(holdStart.current.y - y > 90);
  };

  const endHold = () => {
    if (mode !== "listening") return;
    holdStart.current = null;
    if (cancelArmed) {
      speech.cancel();
      setCancelArmed(false);
      setMode("idle");
      return;
    }
    const heard = speech.stop();
    if (!heard) {
      setMode("idle");
      toast("I didn't quite catch that — hold a moment longer.");
      return;
    }
    ask(heard);
  };

  useEffect(() => { if (mode === "listening") setLive(speech.transcript); }, [speech.transcript, mode]);

  const status =
    mode === "listening" ? (cancelArmed ? "Release to cancel" : "Listening…")
    : mode === "thinking" ? "Reading the menu for you…"
    : mode === "speaking" ? "Speaking…"
    : "Here with you";

  const orbSize = mode === "listening" ? 168 : 148;
  const ring = 1 + speech.level * 0.5;

  return (
    <AppShell hideNav>
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(70% 50% at 50% 62%, color-mix(in oklab, var(--gold) 20%, transparent), transparent 70%)" }} />

      <header className="relative z-20 flex items-center gap-3 px-5 pt-6 pb-2">
        <button onClick={() => router.history.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg leading-none">Aria</h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", mode === "idle" ? "bg-veg" : "bg-gold")} />
            {status}
          </div>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">Voice</span>
      </header>

      {/* stage — the current exchange, large and calm */}
      <section className="relative z-10 flex min-h-[46dvh] flex-col justify-end px-6 pb-4">
        {mode === "listening" || live ? (
          <p className={cn("font-display text-2xl leading-snug transition-colors", cancelArmed ? "text-muted-foreground line-through" : "text-foreground")}>
            {live || <span className="text-muted-foreground">Listening…</span>}
          </p>
        ) : lastAi ? (
          <div className="fade-up">
            {lastUser && <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">You asked · {lastUser.text}</p>}
            <StreamedText
              key={lastAi.id}
              text={lastAi.text}
              className="font-display text-[22px] leading-snug text-foreground"
              onDone={() => setMode((m) => (m === "speaking" ? "idle" : m))}
            />
            {lastAi.cards && (
              <div className="mt-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Aria suggests</p>
                {lastAi.cards.map((cid, i) => <DishSuggestion key={cid} id={cid} delay={i * 90} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="fade-up">
            <p className="font-display text-[26px] leading-snug">Good evening. I'm Aria — a little sommelier, a little host.</p>
            <p className="mt-2 text-sm text-muted-foreground">Hold the orb and tell me what you're in the mood for.</p>
          </div>
        )}
      </section>

      {/* idle prompt chips */}
      {mode === "idle" && !typing && (
        <div className="relative z-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="shrink-0 rounded-full border border-border bg-card/90 px-3.5 py-2 text-xs shadow-soft backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* push-to-talk */}
      <div className="relative z-10 flex flex-col items-center pb-6 pt-4">
        {typing ? (
          <form
            onSubmit={(e) => { e.preventDefault(); ask(draft); setTyping(false); }}
            className="glass mx-5 flex w-[calc(100%-2.5rem)] items-center gap-2 rounded-full py-2 pl-5 pr-2 shadow-elevated"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask Aria anything on the menu…"
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="button" onClick={() => setTyping(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary" aria-label="Back to voice">
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground transition-all disabled:opacity-40"
              style={{ background: "var(--gradient-hero)" }}
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <>
            {mode === "listening" && (
              <div className={cn("mb-3 flex items-center gap-1.5 text-[11px] uppercase tracking-widest transition-colors", cancelArmed ? "text-destructive" : "text-muted-foreground")}>
                {cancelArmed ? <X className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                {cancelArmed ? "Release to cancel" : "Slide up to cancel"}
              </div>
            )}

            <button
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); beginHold(e.clientY); }}
              onPointerMove={(e) => moveHold(e.clientY)}
              onPointerUp={endHold}
              onPointerCancel={() => { speech.cancel(); setMode("idle"); }}
              onContextMenu={(e) => e.preventDefault()}
              disabled={mode === "thinking"}
              className="relative flex touch-none select-none items-center justify-center rounded-full transition-transform active:scale-[0.98] disabled:opacity-70"
              style={{ width: orbSize + 40, height: orbSize + 40 }}
              aria-label="Hold to talk to Aria"
            >
              {/* live level ring */}
              {mode === "listening" && (
                <span
                  className={cn("absolute rounded-full transition-transform duration-75", cancelArmed ? "bg-destructive/15" : "bg-gold/20")}
                  style={{ width: orbSize, height: orbSize, transform: `scale(${ring})` }}
                />
              )}
              {(mode === "thinking" || mode === "speaking") && (
                <span className="pulse-ring absolute rounded-full bg-gold/25" style={{ width: orbSize, height: orbSize }} />
              )}
              <ConciergeOrb size={orbSize} active={mode !== "idle"} className="transition-all duration-300" />
              {mode === "listening" && (
                <span className="absolute bottom-3 flex items-end gap-[3px]">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <span
                      key={i}
                      className="wave-bar inline-block w-[3px] origin-bottom rounded-full bg-gold"
                      style={{ height: 10 + speech.level * 22, animationDelay: `${i * 90}ms` }}
                    />
                  ))}
                </span>
              )}
            </button>

            <p className="mt-3 text-sm font-medium">
              {mode === "listening" ? "Keep holding…" : mode === "thinking" ? <span className="shimmer-text">Thinking…</span> : "Hold to talk"}
            </p>
            {!speech.supported && mode === "idle" && (
              <p className="mt-1 text-[11px] text-muted-foreground">Voice needs Chrome or Safari — you can type instead.</p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => setTyping(true)} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs shadow-soft">
                <Keyboard className="h-3.5 w-3.5" /> Type instead
              </button>
              {messages.length > 0 && (
                <button onClick={() => setSheet(true)} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs shadow-soft">
                  <ChevronUp className="h-3.5 w-3.5" /> Conversation · {messages.filter((m) => m.role === "user").length}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* transcript drawer */}
      {sheet && (
        <div className="fixed inset-0 z-50" role="dialog" aria-label="Conversation transcript">
          <button className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setSheet(false)} aria-label="Close transcript" />
          <div className="fade-up absolute inset-x-0 bottom-0 mx-auto max-h-[78dvh] max-w-md overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5 shadow-elevated">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg">Your conversation</h2>
              <button onClick={() => setSheet(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-soft" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5 pb-6">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex gap-2.5", m.role === "user" && "justify-end")}>
                  {m.role === "ai" && <ConciergeOrb size={26} className="mt-0.5" />}
                  <div className="max-w-[82%]">
                    {m.role === "user" ? (
                      <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-soft">
                        <p className="text-sm">{m.text}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[15px] leading-relaxed text-foreground">{m.text}</p>
                        {m.cards && (
                          <div className="mt-3 space-y-2">
                            {m.cards.map((cid, i) => <DishSuggestion key={cid} id={cid} delay={i * 60} compact />)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
