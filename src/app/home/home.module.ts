import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {HomePage} from './home.page';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {MissionProgressModal} from './mission-progress-modal';
import {StartExpeditionPage} from './start-expedition.page';
import {ExpeditionProgressModal} from './expedition-progress-modal';
import {OddJobsModal} from './odd-jobs-modal';
import {MapSelectionPopover} from './map-selection-popover';

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
            },
            {
                path: 'expedition/:expeditionId',
                component: StartExpeditionPage
            }
        ])
    ],
    declarations: [HomePage, StartExpeditionPage, MissionProgressModal, ExpeditionProgressModal, OddJobsModal, MapSelectionPopover],
    entryComponents: [MissionProgressModal, ExpeditionProgressModal, OddJobsModal, MapSelectionPopover]
})
export class HomePageModule {
}
