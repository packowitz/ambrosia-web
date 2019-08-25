import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AdminGuard} from './services/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: './home/home.module#HomePageModule'
    },
    {
        path: 'properties',
        loadChildren: './properties/properties.module#PropertiesPageModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'herobase',
        loadChildren: './herobase/herobase.module#HerobaseModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'tavern',
        loadChildren: './tavern/tavern.module#TavernModule',
        canActivate: [AdminGuard]
    },
    {path: 'barracks', loadChildren: './barracks/barracks.module#BarracksModule'},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'properties', loadChildren: './properties/properties.module#PropertiesPageModule'},
    {path: 'training', loadChildren: './training/training.module#TrainingPageModule'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
