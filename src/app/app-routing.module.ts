import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AdminGuard} from './services/auth-guard.service';

const routes: Routes = [
    {
        path: 'loading',
        loadChildren: './loading/loading.module#LoadingPageModule'
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
        path: 'expeditions',
        loadChildren: './expeditions/expeditions.module#ExpeditionsModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'oddjobs',
        loadChildren: './oddjobs/oddJobs.module#OddJobsModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'fights',
        loadChildren: './fights/fights.module#FightsModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'loot',
        loadChildren: './loot/loot.module#LootModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'tavern',
        loadChildren: './tavern/tavern.module#TavernModule',
        canActivate: [AdminGuard]
    },
    {
        path: 'story',
        loadChildren: './story/story.module#StoryModule',
        canActivate: [AdminGuard]
    },
    {path: 'account', loadChildren: './account/account.module#AccountPageModule'},
    {path: 'arena', loadChildren: './arena/arena.module#ArenaPageModule'},
    {path: 'barracks', loadChildren: './barracks/barracks.module#BarracksModule'},
    {path: 'vehiclebase', loadChildren: './vehicles/vehicles.module#VehiclesModule'},
    {path: 'academy', loadChildren: './academy/academy.module#AcademyModule'},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'properties', loadChildren: './properties/properties.module#PropertiesPageModule'},
    {path: 'campaign', loadChildren: './campaign/campaign.module#CampaignModule'},
    {path: 'training', loadChildren: './training/training.module#TrainingPageModule'},
    {path: 'garage', loadChildren: './garage/garage.module#GarageModule'},
    {path: 'storage', loadChildren: './storage/storage.module#StorageModule'},
    {path: 'laboratory', loadChildren: './laboratory/laboratory.module#LaboratoryModule'},
    {path: 'jewelry', loadChildren: './jewelry/jewelry.module#JewelryModule'},
    {path: 'forge', loadChildren: './forge/forge.module#ForgeModule'},
    {path: 'bazaar', loadChildren: './bazaar/bazaar.module#BazaarPageModule'},
    {path: 'battle', loadChildren: './battle/battle.module#BattlePageModule'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
