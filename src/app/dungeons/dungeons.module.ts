import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {DungeonsPage} from './dungeons.page';
import {DungeonDetailsPage} from './dungeonDetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DungeonsPage
      },
      {
        path: ':id',
        component: DungeonDetailsPage
      }
    ])
  ],
  declarations: [DungeonsPage, DungeonDetailsPage]
})
export class DungeonsModule {}
