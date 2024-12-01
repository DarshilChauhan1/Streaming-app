import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ResponseHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if(data && data.statusCode) {
            response.status(data.statusCode);
        }
        return data;
      }),
    );
  }
}
