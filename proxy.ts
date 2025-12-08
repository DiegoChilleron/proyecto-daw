import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    
    // Redirección optimista basada en cookie
    // IMPORTANTE: Esto NO es seguro por sí solo.
    // La validación real se hace en cada página con auth.api.getSession()
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",      // Protege /profile y todas sus subrutas
        "/admin/:path*",        // Protege /admin y todas sus subrutas
        "/checkout/:path*",     // Protege el checkout
    ],
};
