"use client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";

interface Props {
  children: React.ReactNode;
}

export const ALBY_CHAT_NAME: string = "carpool-chat";

export default function AlbyProvider({ children }: Props) {
  const client = new Ably.Realtime({ authUrl: "/api" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={ALBY_CHAT_NAME}>{children}</ChannelProvider>
    </AblyProvider>
  );
}
