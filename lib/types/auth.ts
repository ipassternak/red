export interface AuthRefreshPayload {
  sid: string;
  gid: string;
}

export interface AuthAccessPayload {
  gid: string;
  sub: string;
}
