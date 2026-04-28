/**
 * Mistral provider container config — registered when the user has
 * configured a Mistral-compatible endpoint via setup.
 *
 * Supports two modes:
 *   - Anthropic-compatible: ANTHROPIC_BASE_URL + ANTHROPIC_AUTH_TOKEN (placeholder)
 *   - Mistral-native: MISTRAL_BASE_URL + MISTRAL_API_KEY (stored via OneCLI secret)
 *
 * The real auth token never enters the container. Setup creates an
 * OneCLI generic secret so the proxy rewrites the Authorization header.
 */
import { readEnvFile } from '../env.js';
import { registerProviderContainerConfig } from './provider-container-registry.js';

registerProviderContainerConfig('mistral', () => {
  const dotenv = readEnvFile([
    'ANTHROPIC_BASE_URL',
    'MISTRAL_BASE_URL',
    'MISTRAL_API_KEY',
  ]);
  const env: Record<string, string> = {};

  // Mode Anthropic-compatible (ex: Mistral via api.mistral.ai)
  if (dotenv.ANTHROPIC_BASE_URL) {
    env.ANTHROPIC_BASE_URL = dotenv.ANTHROPIC_BASE_URL;
    env.ANTHROPIC_AUTH_TOKEN = 'placeholder';
  }
  // Mode Mistral-native (pour utiliser MISTRAL_API_KEY directement)
  else if (dotenv.MISTRAL_BASE_URL) {
    env.MISTRAL_BASE_URL = dotenv.MISTRAL_BASE_URL;
    if (dotenv.MISTRAL_API_KEY) {
      env.MISTRAL_API_KEY = 'placeholder';
    }
  }

  return { env };
});
