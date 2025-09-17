"use client";

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  } = useVapi();
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center">
      <Button onClick={startCall}>Start Call</Button>
      <Button onClick={endCall} variant="destructive">
        End Call
      </Button>
      <p>isConnecting {`${isConnecting}`}</p>
      <p>isConnected {`${isConnected}`}</p>
      <p>isSpeaking {`${isSpeaking}`}</p>
      <p>{JSON.stringify(transcript)}</p>
    </div>
  );
}
