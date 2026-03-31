import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
//  import { isServer } from '../../../views/shared/constants/is-server.constant';
import { INTERCEPTOR_SKIP_CONSTANT } from './interceptor-skip.constant';

export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const skipIntercept = req.headers.has(
    INTERCEPTOR_SKIP_CONSTANT.AUTHENTICATION,
  );
  if (skipIntercept) return next(req);

  if (!localStorage.getItem('accessToken')) return next(req);
  const modifiedReq = req.clone({
    setHeaders: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  return next(modifiedReq);
};
