import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      redirect("/login");
    }
    return session;
  } catch (error) {
    // Handle database connection errors gracefully
    if (
      error instanceof Error &&
      (error.message.includes("Can't reach database server") ||
        error.message.includes("database server"))
    ) {
      // If database is unreachable, redirect to login as a fallback
      // This prevents the entire app from crashing
      console.error("Database connection error in requireAuth:", error);
      redirect("/login");
    }
    // Re-throw other errors
    throw error;
  }
};

export const requireNoAuth = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session) {
      redirect("/");
    }
    return session;
  } catch (error) {
    // Handle database connection errors gracefully
    if (
      error instanceof Error &&
      (error.message.includes("Can't reach database server") ||
        error.message.includes("database server"))
    ) {
      // If database is unreachable, allow access (no redirect)
      // This prevents the entire app from crashing
      console.error("Database connection error in requireNoAuth:", error);
      return null;
    }
    // Re-throw other errors
    throw error;
  }
};
