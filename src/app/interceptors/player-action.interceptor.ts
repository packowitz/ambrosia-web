import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Model} from '../services/model.service';
import {catchError, map} from 'rxjs/operators';
import {PlayerActionResponse} from '../services/backend.service';
import {JewelryService} from '../services/jewelry.service';
import {AlertController} from '@ionic/angular';

@Injectable()
export class PlayerActionInterceptor implements HttpInterceptor {

    constructor(private model: Model,
                private jewelryService: JewelryService,
                private alertCtrl: AlertController) {}

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
                }),
                catchError((error: HttpErrorResponse) => {
                    console.log("Interceptor caught error");
                    this.alertCtrl.create({
                        header: 'Server error',
                        message: error.error.message,
                        buttons: [{text: 'Okay'}]
                    }).then(data => data.present());
                    return throwError(error);
                })
            );
        } else {
            return next.handle(req);
        }
    }
}








