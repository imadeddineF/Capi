"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader({ duration = 2 }: { duration?: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration * 1000);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={120}
        height={120}
        className="opacity-0 animate-fade-in"
        style={{ animationDuration: `${duration}s` }}
      />
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in ${duration}s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
