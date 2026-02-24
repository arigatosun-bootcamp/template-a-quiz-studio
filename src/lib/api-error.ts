import { NextResponse } from "next/server";

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized() {
  return apiError("認証が必要です", 401);
}

export function badRequest(message: string) {
  return apiError(message, 400);
}

export function notFound(message: string) {
  return apiError(message, 404);
}

export function conflict(message: string) {
  return apiError(message, 409);
}

export function tooManyRequests(message: string) {
  return apiError(message, 429);
}

export function serverError(message = "サーバーエラーが発生しました") {
  return apiError(message, 500);
}
