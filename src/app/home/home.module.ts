import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {HomePage} from './home.page';
import {CommonAmbrosiaModule} from '../common-ambrosia.module';
import {MissionProgressPopover} from './mission-progress-popover';

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ])
    ],
    declarations: [HomePage, MissionProgressPopover],
    entryComponents: [MissionProgressPopover]
})
export class HomePageModule {
}
