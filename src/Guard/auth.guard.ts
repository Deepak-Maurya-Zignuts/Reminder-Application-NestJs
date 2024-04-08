import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the request object from the execution context
    const request = context.switchToHttp().getRequest();

    console.log(request.params.ownerId);
    console.log(request.headers.authorization);

    // Get the token from the request header
    const token = request.headers.authorization;
    if (!token) {
      return false;
    }
    // Verify the token and get the user info
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return false;
    }
    console.log(user);
    // Check if the user id in the token matches the user id in the request params
    if (user.id !== request.params.ownerId) {
      return false;
    }
    return true;
  }
}
