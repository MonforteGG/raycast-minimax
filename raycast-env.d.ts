/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** MiniMax API Key - Your MiniMax API key for authentication */
  "minimaxApiKey": string,
  /** System Prompt - Custom system prompt for AI responses (optional) */
  "systemPrompt"?: string,
  /** Temperature - Controls randomness of responses */
  "temperature": "0.3" | "0.7" | "1.0" | "1.5",
  /** Max Tokens - Maximum length of AI responses */
  "maxTokens": "1024" | "2048" | "4096" | "8192",
  /** Stream Responses - Enable real-time streaming of AI responses */
  "streamResponses": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `ask-ai` command */
  export type AskAi = ExtensionPreferences & {}
  /** Preferences accessible in the `ai-chat` command */
  export type AiChat = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `ask-ai` command */
  export type AskAi = {}
  /** Arguments passed to the `ai-chat` command */
  export type AiChat = {}
}

