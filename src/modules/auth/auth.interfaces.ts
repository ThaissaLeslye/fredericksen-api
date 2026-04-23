export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  googleId: string;
}

export interface RequestWithUser extends Request {
  user: GoogleUser;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
