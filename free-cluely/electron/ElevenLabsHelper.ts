import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"

interface ScribeTokenResponse {
  token: string
}

export class ElevenLabsHelper {
  private client: ElevenLabsClient | null = null
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY
    if (this.apiKey) {
      this.client = new ElevenLabsClient({ apiKey: this.apiKey })
    }
  }

  public isConfigured(): boolean {
    return !!this.apiKey && !!this.client
  }

  public async getScribeToken(): Promise<ScribeTokenResponse> {
    if (!this.client) {
      throw new Error("ElevenLabs API key not configured. Set ELEVENLABS_API_KEY environment variable.")
    }

    // Single-use tokens cannot be cached - always request a fresh one
    try {
      const result = await this.client.tokens.singleUse.create("realtime_scribe")
      return { token: result.token }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      throw new Error(`Failed to get Scribe token: ${errorMessage}`)
    }
  }

}
