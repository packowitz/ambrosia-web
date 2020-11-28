import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {TasksPage} from './tasks.page';
import {TaskClustersPage} from "./taskClusters.page";

@NgModule({
  imports: [
    CommonModule,
    CommonAmbrosiaModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TaskClustersPage
      },
      {
        path: ':id',
        component: TasksPage
      }
    ])
  ],
  declarations: [TaskClustersPage, TasksPage]
})
export class TasksModule {}
