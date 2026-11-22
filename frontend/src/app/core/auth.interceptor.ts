import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './models';

export const TOKEN_KEY = 'sc2.token';

/**
 * Intercepteur HTTP : ajoute le jeton de session à chaque requête et
 * transforme les erreurs du serveur en ApiError (message et erreurs par champ).
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const authorized = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authorized).pipe(
    catchError((response: HttpErrorResponse) => {
      // Statut 0 ou réponse sans message JSON : l'API n'a pas répondu (arrêtée, ou proxy sans cible).
      if (response.status === 0 || !response.error?.error) {
        const message =
          response.status === 0 || response.status >= 500
            ? 'Serveur injoignable. Vérifiez que l’API est lancée.'
            : 'Une erreur est survenue.';
        return throwError(() => new ApiError(message, response.status));
      }
      return throwError(
        () => new ApiError(response.error.error, response.status, response.error.fields ?? {}),
      );
    }),
  );
};
