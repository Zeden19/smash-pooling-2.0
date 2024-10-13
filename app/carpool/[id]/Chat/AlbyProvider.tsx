"use client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import albyChatName from "@/app/carpool/[id]/Chat/AlbyChatName";

interface Props {
  children: React.ReactNode;
}

export default function AlbyProvider({ children }: Props) {
  const client = new Ably.Realtime({ authUrl: "/api" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={albyChatName}>{children}</ChannelProvider>
    </AblyProvider>
  );
}
