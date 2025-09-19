import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

type CallState = "disconnected" | "connecting" | "connected" | "speaking";

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [callState, setConnectionState] = useState<CallState>("disconnected");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // Only for testing, customers will later provide their APIs
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_WIDGET_API_KEY!);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setConnectionState("connected");
      setTranscript([]);
    });
    vapiInstance.on("call-end", () => {
      setConnectionState("disconnected");
    });
    vapiInstance.on("speech-start", () => {
      setConnectionState("speaking");
    });
    vapiInstance.on("speech-end", () => {
      setConnectionState("connected");
    });
    vapiInstance.on("error", (err) => {
      console.log(err, "VAPI_ERROR");
      setConnectionState("disconnected");
    });

    vapiInstance.on("message", (msg) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: msg.role == "user" ? "user" : "assistant",
            text: msg.transcript as string,
          },
        ]);
      }
    });
    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const startCall = () => {
    setConnectionState("connecting");
    if (vapi) {
      // Only for testing, customers will later provide their APIs
      vapi.start(process.env.NEXT_PUBLIC_VAPI_TOM_ASSISTANT_ID);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };
  return {
    callState,
    isSpeaking: callState === "speaking",
    isConnecting: callState === "connecting",
    isConnected: callState === "connected" || callState === "speaking",
    transcript,
    startCall,
    endCall,
  };
};
