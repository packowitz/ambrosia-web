import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class LoadingState {
    playerLoaded = false;
    heroBaseLoaded = false;
    vehicleBaseLoaded = false;
    serviceAccountLoaded = false;
    serviceAccountsLoaded = false;
    enumsLoaded = false;
}