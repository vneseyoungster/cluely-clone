import { useState, useCallback, useRef, useEffect } from "react"
import { useScribe } from "@elevenlabs/react"

interface UseScribeSTTOptions {
  onFinalTranscript?: (transcript: string) => void
  onPartialTranscript?: (transcript: string) => void
  onError?: (error: string) => void
}

interface UseScribeSTTReturn {
  isListening: boolean
  isConnecting: boolean
  partialTranscript: string
  finalTranscript: string
  error: string | null
  start: () => Promise<void>
  stop: () => void
}

export function useScribeSTT(options: UseScribeSTTOptions = {}): UseScribeSTTReturn {
  const { onFinalTranscript, onPartialTranscript, onError } = options

  const [isConnecting, setIsConnecting] = useState(false)
  const [partialTranscript, setPartialTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  const accumulatedTranscript = useRef("")

  const scribe = useScribe({
    onPartialTranscript: (data) => {
      const text = data.text || ""
      setPartialTranscript(text)
      onPartialTranscript?.(text)
    },
    onCommittedTranscript: (data) => {
      const text = data.text || ""
      accumulatedTranscript.current += (accumulatedTranscript.current ? " " : "") + text
      setFinalTranscript(accumulatedTranscript.current)
    },
    onSessionStarted: () => {
      setIsConnecting(false)
      setError(null)
    },
    onError: (err) => {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
      onError?.(errorMsg)
      setIsConnecting(false)
    }
  })

  const start = useCallback(async () => {
    setError(null)
    setPartialTranscript("")
    setFinalTranscript("")
    accumulatedTranscript.current = ""
    setIsConnecting(true)

    try {
      // Get a fresh token from the main process
      const response = await window.electronAPI.getScribeToken()

      if (!response.success || !response.token) {
        throw new Error(response.error || "Failed to get Scribe token")
      }

      // Connect with the token and enable microphone
      await scribe.connect({
        token: response.token,
        modelId: "scribe_v2_realtime",
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start recording"
      setError(errorMsg)
      onError?.(errorMsg)
      setIsConnecting(false)
    }
  }, [scribe, onError])

  const stop = useCallback(() => {
    scribe.disconnect()

    // Finalize transcript
    if (accumulatedTranscript.current) {
      onFinalTranscript?.(accumulatedTranscript.current)
    }
  }, [scribe, onFinalTranscript])

  // Cleanup on unmount only - use ref to avoid dependency on scribe
  const scribeRef = useRef(scribe)
  scribeRef.current = scribe

  useEffect(() => {
    return () => {
      if (scribeRef.current.isConnected) {
        scribeRef.current.disconnect()
      }
    }
  }, []) // Empty deps - only run on unmount

  return {
    isListening: scribe.isConnected,
    isConnecting,
    partialTranscript,
    finalTranscript,
    error,
    start,
    stop
  }
}

export default useScribeSTT
