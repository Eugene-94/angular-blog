import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FbAuthResponse, User } from "src/app/shared/interfaces";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()

export class AuthService {

    public error$: Subject<string> = new Subject<string>()

    constructor(private http: HttpClient) {

    }

    get token(): string {
        const expDate = new Date(localStorage.getItem('fb-token-exp'));
        if (new Date() > expDate) {
            this.logout();
            return null;
        }
        return localStorage.getItem('fb-token');
    }

    login(user: User): Observable<any> {
        user.returnSecureToken = true;

        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken),
                catchError(this.handleError.bind(this))
            )
    }

    logout() {
        this.setToken(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private handleError(e: HttpErrorResponse) {
        const {message} = e.error.error;

        switch (message) {
            case 'INVALID_EMAIL':
                this.error$.next('Неверный email');
                break;
            case 'INVALID_PASSWORD':
                this.error$.next('Неверный пароль');
                break;
            case 'EMAIL_NOT_FOUND':
                this.error$.next('Несуществующий email');
                break;
        }

        console.log(message);

        return throwError(e);
    }

    private setToken(resp: FbAuthResponse | null) {
        if (resp) {
            const expDate = new Date(new Date().getTime() + +resp.expiresIn * 1000);
            localStorage.setItem('fb-token', resp.idToken);
            localStorage.setItem('fb-token-exp', expDate.toString());
        } else {
            localStorage.clear();
        }
        
    }
}
