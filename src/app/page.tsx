"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { FullScreenLoader } from "@/components/shared/FullScreenLoader";

/**
 * Root route. Waits for the auth bootstrap to settle, then sends the user to
 * the dashboard (if a session was restored) or the login screen.
 */
export default function Home() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
    else if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  return <FullScreenLoader label="Getting things ready…" />;
}
