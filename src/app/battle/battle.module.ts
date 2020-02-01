import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {BattlePage} from './battle.page';
import {BattlefieldHero} from './battlefieldHero.directive';
import {CommonAmbrosiaModule} from '../common-ambrosia.module';

const routes: Routes = [
    {
        path: '',
        component: BattlePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [BattlePage, BattlefieldHero]
})
export class BattlePageModule {
}
