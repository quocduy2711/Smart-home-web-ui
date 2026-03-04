"use server";

import { redirect } from "next/navigation";

export async function loginWithGoogleAction() {
    // START: Placeholder for real Google OAuth
    // Since we don't have keys yet, we'll confirm the button works by logging.
    // In a real app, this would redirect to:
    // https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...

    console.log("Redirecting to Google OAuth flow...");

    // For now, let's just pretend we failed because of missing keys
    // or we could redirect to a 'mock' page.
    // Let's redirect to a "Not Implemented" alert or similar on the client via state?
    // Actually, we can just throw an error purely for demo if keys are missing.

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
        throw new Error("Missing Google Client ID. Please configure .env.local");
    }

    // Real code would look like:
    // redirect(url.toString());
}
