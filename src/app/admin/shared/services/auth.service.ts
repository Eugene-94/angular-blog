import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FbAuthResponse, User } from "src/app/shared/interfaces";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()

export class AuthService {
    constructor(private http: HttpClient) {

    }

    get token(): string {
        return localStorage.getItem('fb-token');
    }

    login(user: User): Observable<any> {
        user.returnSecureToken = true;

        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken)
            )
    }

    logout() {

    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private setToken(resp: FbAuthResponse) {
        const expDate = new Date(new Date().getTime() + +resp.expiresIn * 1000);
        localStorage.setItem('fb-token', resp.idToken);
        localStorage.setItem('fb-token-exp', expDate.toString());
    }
}
