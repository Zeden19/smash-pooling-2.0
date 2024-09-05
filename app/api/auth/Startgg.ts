import { OAuth2Client } from "oslo/oauth2";
import { createDate, TimeSpan } from "oslo";

const authorizeEndpoint = "https://start.gg/oauth/authorize";
const tokenEndpoint = "https://api.start.gg/oauth/access_token";

export class Startgg implements OAuth2Provider {
  private client: OAuth2Client;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string, redirectURI: string) {
    this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
      redirectURI,
    });
    this.clientSecret = clientSecret;
  }

  public async createAuthorizationURL(
    state: string,
    options?: { scopes?: string[] },
  ): Promise<URL> {
    return await this.client.createAuthorizationURL({
      state,
      scopes: options?.scopes ?? [],
    });
  }

  public async validateAuthorizationCode(code: string): Promise<StartggTokens> {
    const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
      credentials: this.clientSecret,
    });
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
    };
  }

  // Current implementation will not work: to refresh a token in Start.gg, you need a POST request to
  // "api.start.gg/oauth/refresh". refreshAccessToken will (through sendTokenRequest in Oslo) will send
  // a POST request to the end point, that being "https://api.start.gg/oauth/access_token"

  // public async refreshAccessToken(refreshToken: string, scopes?: string[]): Promise<StartggTokens> {
  // 	const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
  // 		credentials: this.clientSecret,
  // 		scopes: scopes
  // 	});
  // 	return {
  // 		accessToken: result.access_token,
  // 		refreshToken: result.refresh_token,
  // 		accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
  // 	};
  // }
}
interface TokenResponseBody {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface StartggTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
}

export interface OAuth2Provider {
  createAuthorizationURL(state: string): Promise<URL>;

  validateAuthorizationCode(code: string): Promise<Tokens>;

  refreshAccessToken?(refreshToken: string): Promise<Tokens>;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date | null;
  idToken?: string;
}
