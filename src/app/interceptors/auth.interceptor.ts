import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let key = environment.production ? 'ambrosia-jwt' : 'jwt';
        let token = localStorage.getItem(key);
        if (token) {
            req = req.clone({setHeaders: {Authorization: 'Bearer ' + token}});
        }
        return next.handle(req);
    }
}