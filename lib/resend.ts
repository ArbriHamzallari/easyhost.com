import "dotenv/config";
import { Resend } from "resend";

const globalForResend = globalThis as unknown as {
  resend?: Resend;
};

function createResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

function getResend(): Resend {
  if (globalForResend.resend) return globalForResend.resend;
  const client = createResend();
  if (process.env.NODE_ENV !== "production") {
    globalForResend.resend = client;
  }
  return client;
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop, receiver) {
    return Reflect.get(getResend(), prop, receiver);
  },
});

export function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "EasyHost <hello@easyhost.pro>";
}
