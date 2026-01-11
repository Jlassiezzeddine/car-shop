import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Set withCredentials to true for all requests to enable cookie handling
  // Cookies are automatically sent with requests when withCredentials is true
  const clonedReq = req.clone({
    withCredentials: true,
  });
  return next(clonedReq);
};
