import prisma from "@/prisma/prismaClient";
import { Session, User } from "@prisma/client";

interface SessionWithToken extends Session {
  token: string;
}

function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    // >> 3 "removes" the right-most 3 bits of the byte
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

export async function createSession(userId: string): Promise<SessionWithToken> {
  const now = new Date();

  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);

  const token = id + "." + secret;

  const session: SessionWithToken = {
    id,
    userId,
    secretHash: Buffer.from(secretHash),
    createdAt: now,
    token,
  };

  await prisma.session.create({
    data: {
      id,
      userId,
      secretHash: session.secretHash,
      createdAt: now,
    },
  });

  return session;
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}

const sessionExpiresInSeconds = 60 * 60 * 24 * 365; // 1 day

export async function validateSessionToken(
  token: string,
): Promise<{ session: Session | null; user: User | null }> {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 2) {
    return { session: null, user: null };
  }
  const sessionId = tokenParts[0];
  const sessionSecret = tokenParts[1];

  const session = await getSession(sessionId);
  if (!session) {
    return { session: null, user: null };
  }

  const tokenSecretHash = await hashSecret(sessionSecret);
  const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
  if (!validSecret) {
    return { session: null, user: null };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return { session: null, user: null };
  }

  return { session, user: user };
}

async function getSession(sessionId: string): Promise<Session | null> {
  const now = new Date();

  const result = await prisma.session.findMany({
    where: {
      id: sessionId,
    },
  });

  if (!result) {
    return null;
  }

  if (result.length !== 1) {
    return null;
  }

  const userSession = result[0];
  const user = await prisma.user.findUnique({ where: { id: userSession.userId } });

  if (!user) {
    return null;
  }

  const session: Session = {
    id: userSession.id,
    userId: user.id,
    secretHash: userSession.secretHash,
    createdAt: userSession.createdAt,
  };

  // Check expiration
  if (now.getTime() - session.createdAt.getTime() >= sessionExpiresInSeconds * 1000) {
    await deleteSession(sessionId);
    return null;
  }

  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  prisma.session.delete({ where: { id: sessionId } });
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  let c = 0;
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i] ^ b[i];
  }
  return c === 0;
}
