import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AdminGuard} from './services/auth-guard.service';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {PlayerActionInterceptor} from './interceptors/player-action.interceptor';
import {FormsModule} from '@angular/forms';
import {EnumService} from './services/enum.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        AdminGuard,
        StatusBar,
        SplashScreen,
        EnumService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: PlayerActionInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
