import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error?.error?.message}`;
    } else {
      // Server-side error
      errorMessage =
        error?.error?.message || 'Internal server error has occurred.';
    }
    return throwError(() => errorMessage);
  }
}
