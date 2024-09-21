import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import { PrismaClient } from "@prisma/client";
import { Startgg } from "@/app/api/auth/Startgg";

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      startggId: attributes.startggId,
      slug: attributes.slug,
      gamertag: attributes.gamertag,
      email: attributes.email,
      profilePicture: attributes.profilePicture,
      isDriver: attributes.isDriver,
      fullName: attributes.fullName,
      carInfo: attributes.carInfo,
      carSeats: attributes.carSeats,
      phoneNumber: attributes.phoneNumber,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  startggId: number;
  slug: string;
  gamertag: string;
  email: string;
  profilePicture: string;

  isDriver: boolean;
  fullName: string;
  carInfo: string;
  carSeats: string;
  phoneNumber: string;
}

export const startgg = new Startgg(
  process.env.STARTGG_CLIENT_ID!,
  process.env.STARTGG_CLIENT_SECRET!,
  "http://localhost:3000/api/login/startgg/callback",
);
