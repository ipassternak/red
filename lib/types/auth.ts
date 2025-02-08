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
