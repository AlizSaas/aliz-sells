import { redirect } from "next/navigation";
import { cache } from "react";
import { getAuthSession } from "../admin/require-admin";

export const requireUser = cache(async() => {
  const session = await getAuthSession();
  if (!session) {
    return redirect('/login')
  }
    console.log("User verified for:", session.user.email)
    return session;
}); 