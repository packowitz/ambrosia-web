import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {HerobaseCreatePage} from './herobase-create.page';
import {HerobaseListPage} from './herobase-list.page';
import {HerobaseEditPage} from './herobase-edit.page';
import {SkillIconModal} from './skillIcon.modal';
import {HeroAvatarModal} from './heroavatar.modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'create',
        component: HerobaseCreatePage
      },
      {
        path: 'list',
        component: HerobaseListPage
      },
      {
        path: 'edit/:id',
        component: HerobaseEditPage
      }
    ])
  ],
  declarations: [HerobaseCreatePage, HerobaseListPage, HerobaseEditPage, SkillIconModal, HeroAvatarModal],
  entryComponents: [SkillIconModal, HeroAvatarModal]
})
export class HerobaseModule {}
