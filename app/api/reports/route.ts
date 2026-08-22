import { queryReports } from "@/lib/reports/query";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  return Response.json(queryReports(request.nextUrl.searchParams), {
    headers: { "Cache-Control": "no-store" },
  });
}
