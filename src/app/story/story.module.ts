import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {StoryPage} from './story.page';
import {PlaceholderPopover} from './placeholder.popover';
import {StoryPicSelectionPopover} from './storyPicSelection.popover';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: StoryPage
      }
    ])
  ],
  declarations: [StoryPage, PlaceholderPopover, StoryPicSelectionPopover],
  entryComponents: [PlaceholderPopover, StoryPicSelectionPopover]
})
export class StoryModule {}
