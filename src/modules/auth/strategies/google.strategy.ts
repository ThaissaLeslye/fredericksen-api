import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

import { GoogleUser } from '../auth.interfaces';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<GoogleUser> {
    const { id, name, emails, photos: userPhotos } = profile;

    const picture =
      userPhotos && userPhotos.length > 0 ? userPhotos[0].value : '';

    if (!emails || emails.length === 0) {
      throw new Error('No email found in Google profile');
    }

    if (!name) {
      throw new Error('No name found in Google profile');
    }

    const user: GoogleUser = {
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture,
      accessToken,
    };

    return Promise.resolve(user);
  }
}
