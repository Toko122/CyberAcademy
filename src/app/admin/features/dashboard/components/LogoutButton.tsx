"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        let redirectTo = "/admin/login";
        try {
          const response = await fetch("/api/admin/logout", {
            method: "POST",
            credentials: "same-origin",
            cache: "no-store",
          });
          const payload = response.ok ? await response.json() : null;
          redirectTo = payload?.redirectTo || redirectTo;
        } finally {
          // Even if the network response is interrupted, leave the protected UI.
          // Middleware will reject the next request unless logout cleared the cookie.
          window.location.replace(redirectTo);
        }
      }}
      className="min-h-11 w-full sm:w-auto rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
