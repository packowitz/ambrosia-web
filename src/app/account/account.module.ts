import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {AccountPage} from './account.page';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';

const routes: Routes = [
    {
        path: '',
        component: AccountPage
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
    declarations: [AccountPage]
})
export class AccountPageModule {
}
