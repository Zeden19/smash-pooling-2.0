import { Carpool, CarpoolStatus, User } from "prisma/prisma-client";

export interface CarpoolNumber {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  route: string;
  id: number;
  driverId: string;
  originName: string;
  destinationName: string;
  tournamentSlug: string;
  seatsAvailable: number | null;
  distance: string;
  startTime: Date | null;
  description: string | null;
  status: CarpoolStatus;
}

export interface CarpoolAttendeesDriver extends Carpool {
  driver: User;
  attendees: User[];
}
