"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getMany);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <p>web/app</p>
      <div className="max-auto w-full max-w-sm">{JSON.stringify(users)}</div>
    </div>
  );
}
