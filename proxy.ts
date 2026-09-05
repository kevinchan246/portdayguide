import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function secure(response: NextResponse) {
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (request.nextUrl.pathname === "/ports/george-town-grand-cayman" || request.nextUrl.pathname.startsWith("/ports/george-town-grand-cayman/")) {
    const canonical = request.nextUrl.clone();
    canonical.pathname = canonical.pathname.replace("/ports/george-town-grand-cayman", "/ports/grand-cayman");
    return secure(NextResponse.redirect(canonical, 308));
  }
  if (hostname === "verdant-souffle-f6e570.netlify.app") {
    const canonical = request.nextUrl.clone();
    canonical.protocol = "https:";
    canonical.hostname = "portdayguide.com";
    canonical.port = "";
    return secure(NextResponse.redirect(canonical, 301));
  }
  if (hostname === "www.portdayguide.com") {
    const canonical = request.nextUrl.clone();
    canonical.protocol = "https:";
    canonical.hostname = "portdayguide.com";
    canonical.port = "";
    return secure(NextResponse.redirect(canonical, 308));
  }
  return secure(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/|favicon.svg).*)"],
};
