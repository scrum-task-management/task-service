import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(request: any) {
    const decoded = jwt_decode(request?.cookies?.Authentication);

    if ((decoded as any)?.userId) {
      request.user = decoded;
      return true;
    }

    return false;
  }
}
