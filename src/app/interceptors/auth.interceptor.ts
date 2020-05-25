import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Model} from '../services/model.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private model: Model) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token: string;
        if (this.model.useServiceAccount && req.url.indexOf('/admin/') === -1) {
            token = localStorage.getItem(environment.serviceTokenKey);
        }
        if (!token) {
            token = localStorage.getItem(environment.tokenKey);
        }
        if (token) {
            req = req.clone({setHeaders: {Authorization: 'Bearer ' + token}});
        }
        return next.handle(req);
    }
}