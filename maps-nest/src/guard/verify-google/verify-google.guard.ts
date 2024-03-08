import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VerifyGoogleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    try {
      if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.split(' ')[1];
        const response = await axios.get(
          `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`,
        );
        if (response && response.data && response.data.email) {
          request.email = response.data.email;
          return true;
        } else {
          throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException(
          'Authorization header missing or invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      if (error.response && error.response.status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
