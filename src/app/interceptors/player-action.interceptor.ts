import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Model} from '../services/model.service';
import {map} from 'rxjs/operators';
import {PlayerActionResponse} from '../services/backend.service';
import {JewelryService} from '../services/jewelry.service';

@Injectable()
export class PlayerActionInterceptor implements HttpInterceptor {

    constructor(private model: Model, private jewelryService: JewelryService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method === 'POST') {
            return next.handle(req).pipe(
                map(event => {
                    if (event instanceof HttpResponse) {
                        let action = event.body as PlayerActionResponse;
                        this.model.update(action);
                        this.jewelryService.updateJewelries(action.jewelries);
                    }
                    return event;
                })
            );
        } else {
            return next.handle(req);
        }
    }
}








