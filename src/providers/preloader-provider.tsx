"use client";

import React, { useState, useEffect } from "react";
import Preloader from "@/components/shared/pre-loader";

export default function PreloaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader duration={2} />;
  }

  return <>{children}</>;
}
