import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.params.ownerId);
    console.log(request.headers.authorization);
    const token = request.headers.authorization;
    if (!token) {
      return false;
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return false;
    }
    console.log(user);
    if (user.id !== request.params.ownerId) {
      return false;
    }
    return true;
  }
}
