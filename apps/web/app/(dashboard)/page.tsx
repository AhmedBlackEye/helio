"use client";

import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);
  return (
    <>
      <Authenticated>
        <div className="flex min-h-svh flex-col items-center justify-center">
          <p>web/app</p>
          <UserButton />
          <OrganizationSwitcher hidePersonal={true} />
          <Button onClick={() => addUser()}>add</Button>
          <div className="max-auto w-full max-w-sm">
            {JSON.stringify(users)}
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton>Sign in</SignInButton>
      </Unauthenticated>
    </>
  );
}
