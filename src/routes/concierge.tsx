import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { ConciergeOrb } from "@/components/dine/ConciergeOrb";
import { ArrowLeft, Clock3, Flame, Mic, Plus, Send, Star } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { dishes } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/concierge")({
  component: Concierge,
  head: () => ({
    meta: [
      { title: "Aria, your AI Concierge — DineAI" },
      { name: "description", content: "Chat with Aria, the DineAI concierge, for pairings, recommendations, and dietary guidance at your table." },
      { property: "og:title", content: "Aria — your table's AI concierge" },
      { property: "og:description", content: "Warm, knowledgeable guidance from the digital host." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Msg = { id: string; role: "ai" | "user"; text: string; cards?: string[]; stream?: boolean };

const suggestions = [
  "Something light and vegetarian",
  "Pair the wagyu with a drink",
  "Nut-free desserts?",
  "What's the chef most proud of tonight?",
];

const scripted: Record<string, Omit<Msg, "id">> = {
  default: {
    role: "ai",
    text: "Two thoughts: our black truffle tagliolini if you're in the mood for something quiet, or the wagyu if you'd like the room to notice. Either way, I'd start with the burrata.",
    cards: ["truffle-pasta", "wagyu-steak", "burrata"],
  },
  vegetarian: {
    role: "ai",
    text: "For something light and green — the heirloom burrata, then the tagliolini. Both meatless. Both memorable.",
    cards: ["burrata", "truffle-pasta"],
  },
  pair: {
    role: "ai",
    text: "The wagyu pairs beautifully with our smoked negroni — the applewood echoes the char. Want me to add one?",
    cards: ["smoke-negroni"],
  },
  dessert: {
    role: "ai",
    text: "The molten chocolate is nut-free tonight. Rich, but the vanilla balances it.",
    cards: ["lava"],
  },
  chef: {
    role: "ai",
    text: "Chef Anaïs is quietly proud of the tagliolini — she rolled the pasta this morning. It's her mother's recipe.",
    cards: ["truffle-pasta"],
  },
};

function reply(text: string): Msg {
  const t = text.toLowerCase();
  const pick =
    t.includes("veg") ? scripted.vegetarian
    : t.includes("pair") || t.includes("drink") || t.includes("wine") || t.includes("wagyu") ? scripted.pair
    : t.includes("dessert") || t.includes("nut") ? scripted.dessert
    : t.includes("chef") || t.includes("proud") || t.includes("special") ? scripted.chef
    : scripted.default;
  return { ...pick, id: crypto.randomUUID(), stream: true };
}

/** Reveals the concierge's words one at a time, like it's thinking out loud. */
function StreamedText({ text, stream, onDone }: { text: string; stream?: boolean; onDone?: () => void }) {
  const words = text.split(" ");
  const [count, setCount] = useState(stream ? 0 : words.length);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!stream) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= words.length) {
        clearInterval(id);
        doneRef.current?.();
      }
    }, 42);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, stream]);

  return (
    <p className="text-[15px] leading-relaxed text-foreground">
      {words.slice(0, count).join(" ")}
      {count < words.length && (
        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 rounded-full bg-gold align-middle" style={{ animation: "orb-breathe 1s ease-in-out infinite" }} />
      )}
    </p>
  );
}

function DishSuggestion({ id, delay }: { id: string; delay: number }) {
  const { add } = useCart();
  const d = dishes.find((x) => x.id === id);
  if (!d) return null;
  return (
    <div
      className="fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-soft transition-shadow hover:shadow-elevated"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <img src={d.image} alt={d.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
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

function Concierge() {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([{
    id: "hi", role: "ai",
    text: "Good evening. I'm Aria — a little bit sommelier, a little bit host. What are you in the mood for tonight?",
  }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setSpeaking(true);
      setMessages((m) => [...m, reply(text)]);
    }, 900);
  };

  const status = thinking ? "Thinking…" : speaking ? "Speaking…" : listening ? "Listening…" : "Here with you";

  return (
    <AppShell>
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-64 opacity-70"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 70%)" }} />

      <header className="sticky top-0 z-20 px-5 pt-6 pb-3 glass">
        <div className="flex items-center gap-3">
          <button onClick={() => router.history.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-3">
            <ConciergeOrb size={44} active={thinking || speaking || listening} />
            <div>
              <div className="font-display text-lg leading-none">Aria</div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${thinking || speaking ? "bg-gold" : "bg-veg"}`} />
                {status}
              </div>
            </div>
          </div>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">AI</span>
        </div>
      </header>

      <section className="relative z-10 space-y-5 px-5 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`fade-up flex gap-2.5 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "ai" && <ConciergeOrb size={30} className="mt-0.5" />}
            <div className="max-w-[82%]">
              {m.role === "user" ? (
                <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-soft">
                  <p className="text-sm">{m.text}</p>
                </div>
              ) : (
                <>
                  <StreamedText text={m.text} stream={m.stream} onDone={() => setSpeaking(false)} />
                  {m.cards && (
                    <div className="mt-3 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Aria suggests</p>
                      {m.cards.map((cid, i) => (
                        <DishSuggestion key={cid} id={cid} delay={i * 90} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="fade-up flex items-center gap-2.5">
            <ConciergeOrb size={30} active />
            <span className="shimmer-text text-sm font-medium">Reading the menu for you…</span>
          </div>
        )}
        <div ref={endRef} />
      </section>

      {/* suggestion rail — always available */}
      <div className="fixed inset-x-0 bottom-[8.5rem] z-30">
        <div className="mx-auto max-w-md">
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="shrink-0 rounded-full border border-border bg-card/90 px-3.5 py-2 text-xs shadow-soft backdrop-blur transition-colors hover:border-gold hover:text-gold"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-20 z-30 px-4 pb-2">
        <div className="mx-auto max-w-md">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="glass flex items-center gap-2 rounded-full py-2 pl-5 pr-2 shadow-elevated"
          >
            {listening ? (
              <div className="flex flex-1 items-center gap-2 py-2">
                <div className="flex items-end gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="wave-bar inline-block h-4 w-[3px] origin-bottom rounded-full bg-gold" style={{ animationDelay: `${i * 110}ms` }} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Listening…</span>
              </div>
            ) : (
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aria anything on the menu…"
                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
            )}
            <button
              type="button"
              onClick={() => setListening((v) => !v)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${listening ? "bg-gold/15 text-gold" : "text-muted-foreground hover:text-primary"}`}
              aria-label="Voice"
              aria-pressed={listening}
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground transition-all disabled:opacity-40"
              style={{ background: "var(--gradient-hero)" }}
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
