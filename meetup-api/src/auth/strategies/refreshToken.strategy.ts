import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersSevice: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: configService.get<string>('refreshSecret'),
      passReqToCallback: true,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.Refresh) {
      return req.cookies.Refresh;
    }
    return null;
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies.Refresh;
    return this.usersSevice.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}
