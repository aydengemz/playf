"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";

declare global {
  type TTQMethod = (...args: unknown[]) => void;
  interface TTQ {
    track: (
      eventName: string,
      params?: Record<string, unknown>,
      options?: { event_id?: string }
    ) => void;
    page: TTQMethod;
    identify?: TTQMethod;
    instances?: TTQMethod;
    debug?: TTQMethod;
    on?: TTQMethod;
    off?: TTQMethod;
    once?: TTQMethod;
    ready?: TTQMethod;
    alias?: TTQMethod;
    group?: TTQMethod;
    enableCookie?: TTQMethod;
    disableCookie?: TTQMethod;
    holdConsent?: TTQMethod;
    revokeConsent?: TTQMethod;
    grantConsent?: TTQMethod;
  }
  interface Window { ttq?: TTQ }
}

export default function Home() {
  // ----- state -----
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState(0); // Start: 0 for animation
  const [finalAmount] = useState(100);     // Final amount for counter (won't change)
  const [toasts, setToasts] = useState<
    { id: number; icon: string; title: string; text: string }[]
  >([]);
  const toastId = useRef(0);

  // ----- config -----
  const BASE_DEST_URL = "https://rwrdtrk.com/aff_c?offer_id=2691&aff_id=11848&source=";

  // (Pixel) — your new TikTok Pixel ID
  const TIKTOK_PIXEL_ID = "D40E2VRC77UD89P2K3TG";

  // Names + messages
  const NAMES = useMemo(
    () => [
      "Ava R.","Ethan T.","Luna W.","Caleb R.","Aria K.","Julian P.","Piper S.","Gabriel L.","Sofia G.","Alexander T.",
      "Mia M.","Logan D.","Isabella W.","Benjamin R.","Charlotte K.","Oliver P.","Abigail S.","Elijah L.","Emily G.","William T.",
      "Harper M.","Lucas D.","Amelia W.","Mason R.","Evelyn K.","Liam P.","Hannah S.","Noah L.","Abigail G.","Ethan T.",
      "Zoe M.","Jackson B.","Victoria L.","Daniel K.","Madison P.","Samuel R.","Grace H.","Henry W.","Scarlett F.","Sebastian M.",
      "Chloe D.","Wyatt S.","Penelope R.","Owen L.","Layla K.","Nathan P.","Riley S.","Leo M.","Hazel G.","Isaac T.",
    ],
    []
  );

  const NOTIFICATIONS = useMemo(
    () => [
      { icon: "👥", title: "Active Viewers", text: "12 people are viewing this offer right now" },
      { icon: "🎉", title: "Recent Claims", text: "3 people claimed their reward in the last 5 minutes" },
      { icon: "📍", title: "Local Activity", text: "5 people in your city just claimed rewards" },
      { icon: "🔥", title: "Trending Now", text: "This offer is trending in your area" },
      { icon: "⭐", title: "Popular Offer", text: "Popular offer - 45 people claimed today" },
      { icon: "🌍", title: "Nearby Activity", text: "Trending in your area - 8 people nearby just claimed" },
      { icon: "🎯", title: "Almost There", text: "You're 2 steps away from claiming your reward" },
      { icon: "⏳", title: "Limited Spots", text: "Only 3 spots left for today's rewards" },
      { icon: "📊", title: "Reward Status", text: "Reward pool is 89% depleted" },
      { icon: "⏰", title: "Time Sensitive", text: "Last chance to claim before cards run out" },
    ],
    []
  );

  // ----- mount -----
  useEffect(() => {
    setIsVisible(true);

    const fireVC = () => {
      if (window.ttq) {
        window.ttq.track("ViewContent", {
          content_type: "product",
          content_id: "playful-lander",
          currency: "USD",
          value: 0,
        });
      } else {
        setTimeout(fireVC, 50);
      }
    };
    fireVC();
    // amount counter: animate 0 -> finalAmount
    const start = 0;
    const end = finalAmount;
    const duration = 2000;
    let startTs: number | null = null;

    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const val = Math.floor(p * (end - start) + start);
      setAmount(val);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    // start toasts after 3s, then every 8-12s
    const first = setTimeout(() => {
      pushRandomToast();
      const iv = setInterval(() => {
        pushRandomToast();
      }, 8000 + Math.random() * 4000);
      // Clean up interval
      return () => clearInterval(iv);
    }, 3000);

    return () => clearTimeout(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalAmount]);

  // ----- helpers -----
  const pushRandomToast = () => {
    const id = ++toastId.current;
    const isName = Math.random() > 0.5;

    if (isName) {
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      setToasts((t) => [
        ...t,
        { id, icon: "💵", title: "Recent Claim", text: `${randomName} claimed $100!` },
      ]);
    } else {
      const pick = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
      setToasts((t) => [...t, { id, ...pick }]);
    }

    // auto-remove after 5s
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 5000);
  };

  // Pixel helpers
  const getTTCLID = () => {
    try { return new URLSearchParams(window.location.search).get("ttclid") || ""; }
    catch { return ""; }
  };
  const makeEventId = (prefix: string) =>
    `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;

  // ----- CTA handler: fire AddToCart, then redirect -----
  const handleCTA = useCallback(() => {
    if (typeof window === "undefined") return;
  
    // Fire ATC event
    try {
      const eventId = makeEventId("atc");
      window.ttq?.track(
        "AddToCart",
        {
          content_type: "product",
          content_id: "playful-app-100",
          value: 0.5,
          currency: "USD",
        },
        { event_id: eventId }
      );
    } catch {}
  
    // Extract source from "?testsource&ttclid=..."
    const params = new URLSearchParams(window.location.search);
    const keys = [...params.keys()];
    let source = "";
  
    if (keys.length > 0) {
      const firstKey = keys[0];
      if (firstKey.toLowerCase() !== "ttclid") {
        source = firstKey;
      } else if (keys.length > 1) {
        source = keys[1];
      }
    }
  
    const destUrl = source
      ? `${BASE_DEST_URL}${encodeURIComponent(source)}`
      : BASE_DEST_URL;

    alert(destUrl);

    setTimeout(() => {
      window.location.href = destUrl;
    }, 400);
  }, [BASE_DEST_URL]);
  
  

  // spawn floating emoji (🦇 🎃 🕸️)
  const ornaments = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const pool = ["🦇", "🎃", "🕸️"];
      const emoji = pool[Math.floor(Math.random() * pool.length)];
      const left = Math.floor(Math.random() * 100); // vw
      const dur = 6 + Math.random() * 8; // s
      const size = 16 + Math.random() * 16; // px
      return { id: i, emoji, left, dur, size };
    });
  }, []);

  return (
    <>
      {/* TikTok Pixel loader — runs after hydration */}
      <Script id="tiktok-pixel" strategy="afterInteractive">
        {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i=ttq._i||{},ttq._i[e]=[];
    ttq._t=ttq._t||{},ttq._t[e]=+new Date;
    ttq._o=ttq._o||{},ttq._o[e]=n||{};
    n=d.createElement("script"); n.type="text/javascript"; n.async=!0; n.src=r+"?sdkid="+e+"&lib="+t;
    var s=d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(n,s)
  };
  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');
        `}
      </Script>

      <Head><title>Playful Rewards</title></Head>

      {/* Background */}
      <div className="min-h-screen relative overflow-x-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at 50% -200px, #fff7ec 0%, #ffe9d1 45%, #ffe0bf 80%, #ffd7ad 100%)",
          }}
        />

        {/* Floating ornaments */}
        {ornaments.map((o) => (
          <div
            key={o.id}
            className="fixed top-[-40px] z-0 opacity-60 pointer-events-none animate-flyDown"
            style={{ left: `${o.left}vw`, animationDuration: `${o.dur}s`, fontSize: `${o.size}px` }}
          >
            {o.emoji}
          </div>
        ))}

        {/* Toasts */}
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-xs space-y-3">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="bg-white/95 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(255,106,0,0.15)] border border-[#ff6a0033] px-4 py-3 flex gap-3 animate-slideDown"
            >
              <div className="w-6 h-6 rounded-full bg-[#ff6a00] text-white flex items-center justify-center text-xs">
                {t.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{t.title}</div>
                <div className="text-[13px] text-slate-600">{t.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Page container */}
        <div className="min-h-screen flex items-center justify-center p-5 relative z-10">
          {/* Card */}
          <div
            className={`max-w-md w-full bg-white/95 rounded-3xl border border-[#ff6a0033] shadow-[0_10px_30px_rgba(255,106,0,0.1),0_1px_8px_rgba(255,106,0,0.18)] backdrop-blur-md p-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } animate-cardFloat`}
          >
            {/* Logo / header */}
            <div className="text-center mb-2 pb-2 border-b border-[#ff6a001a] relative">
              <span className="absolute -top-2 left-[calc(50%-80px)] w-[18px] h-[18px] rounded-full shadow-[0_0_12px_rgba(255,106,0,0.2),0_0_30px_rgba(255,106,0,0.1)]"
                style={{ background: "radial-gradient(circle at 30% 30%, #ff9d4d 0%, #ff6a00 60%, #ff3d00 100%)" }} />
              <span className="absolute -top-2 right-[calc(50%-80px)] w-[18px] h-[18px] rounded-full shadow-[0_0_12px_rgba(255,106,0,0.2),0_0_30px_rgba(255,106,0,0.1)]"
                style={{ background: "radial-gradient(circle at 30% 30%, #ff9d4d 0%, #ff6a00 60%, #ff3d00 100%)" }} />

              <div className="mx-auto">
                <Image
                  src="/plafff.png"
                  alt="a"
                  width={150}
                  height={150}
                  className="rounded-md mx-auto drop-shadow-[0_4px_12px_rgba(255,106,0,0.3)]"
                  style={{ filter: "hue-rotate(330deg) saturate(1.2)" }}
                  priority
                />
              </div>
              <div className="text-2xl font-extrabold mt-2 text-[#2f3033] drop-shadow-[0_2px_10px_rgba(255,106,0,0.12)]">
                Playful Rewards 🎃
              </div>
              <div className="mt-2">
                <Image
                  src="/verd.png"
                  alt="Verified"
                  width={120}
                  height={120}
                  className="mx-auto"
                  style={{ filter: "hue-rotate(330deg) saturate(1.05)" }}
                />
              </div>
            </div>

            {/* Amount */}
            <div className="text-center text-[2.2rem] font-bold text-[#ff6a00] drop-shadow-[0_3px_14px_rgba(255,106,0,0.2)] animate-amountPulse">
              ${amount.toFixed(2)}
            </div>
            <div className="text-center text-[1.1rem] font-semibold text-[#5a5b60] -mt-1">
              Sent to you • Spooky Special 👻
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 rounded-2xl border border-[#ff6a001a] bg-[#ff6a000c]">
              {[
                "Click the Button Below 🍬",
                "Enter Your Email & Info 🕯️",
                "Complete at least 3-5 Deals 🕸️",
                "Claim Reward & Repeat 🧙",
              ].map((txt, i) => (
                <div key={i} className="flex items-center justify-center gap-3 py-2 font-semibold text-[#2f3033]">
                  <span className="w-6 h-6 rounded-full bg-[#ff6a00] text-white text-sm font-bold shadow-[0_2px_8px_rgba(255,106,0,0.35)] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className={i === 2 ? "underline decoration-[#ff6a00] decoration-2 underline-offset-2" : ""}>
                    {txt}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-4">
              <button
                onClick={handleCTA}
                className="w-full bg-gradient-to-r from-[#ff6a00] to-[#ff3d00] text-white py-4 rounded-2xl font-extrabold text-[1.1rem] shadow-[0_10px_30px_rgba(255,106,0,0.3),0_5px_15px_rgba(255,106,0,0.2)] transition-transform hover:-translate-y-1"
              >
                Get Your $100 Treat →
              </button>
              <div className="mt-3">
                <Image
                  src="/trus2.png"
                  alt="Trust Badge"
                  width={800}
                  height={200}
                  className="w-full rounded-xl opacity-90 transition-opacity hover:opacity-100"
                  style={{ filter: "hue-rotate(330deg) saturate(1.05)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* keyframes */}
      <style jsx global>{`
        @keyframes cardFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-cardFloat { animation: cardFloat 3s ease-in-out infinite; }
        @keyframes amountPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .animate-amountPulse { animation: amountPulse 2s infinite; }
        @keyframes flyDown {
          0% { transform: translateY(-60px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(50vh) translateX(20px) rotate(10deg); }
          100% { transform: translateY(110vh) translateX(-20px) rotate(-8deg); opacity: 0; }
        }
        .animate-flyDown { animation-name: flyDown; animation-timing-function: linear; animation-iteration-count: infinite; }
        @keyframes slideDown { from { transform: translate(-50%,-100%); opacity: 0; } to { transform: translate(-50%,0); opacity: 1; } }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </>
  );
}
