export interface AuthRefreshPayload {
  use?: 'refresh';
  sid: string;
  gid: string;
}

export interface AuthAccessPayload {
  use?: 'access';
  gid: string;
  sub: string;
}

export interface OAuthGooglePayload {
  id: string;
  displayName: string;
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
}
