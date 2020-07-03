import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {OddJobsPage} from './oddJobs.page';

@NgModule({
  imports: [
    CommonModule,
    CommonAmbrosiaModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OddJobsPage
      }
    ])
  ],
  declarations: [OddJobsPage]
})
export class OddJobsModule {}
