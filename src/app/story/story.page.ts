import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {PopoverController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {StoryPlaceholder} from '../domain/storyPlaceholder.model';
import {PlaceholderPopover} from './placeholder.popover';
import {Story} from '../domain/story.model';
import {StoryPicSelectionPopover} from './storyPicSelection.popover';

@Component({
  selector: 'story',
  templateUrl: 'story.page.html'
})
export class StoryPage implements OnInit {

  saving = false;

  placeholders: StoryPlaceholder[];

  storyTrigger: string;
  lootBoxId: number;

  stories: Story[];
  storiesToDelete: Story[] = [];

  constructor(public model: Model,
              public enumService: EnumService,
              private backendService: BackendService,
              private popoverCtrl: PopoverController) {}

  ngOnInit(): void {
    this.backendService.getStoryPlaceholder().subscribe(data => {
      this.placeholders = data;
    });
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  resetStoryLine() {
    this.backendService.resetStoryLine().subscribe(() => {
      this.model.knownStories = [];
    });
  }

  newPlaceholder() {
    this.openPlaceholderPopover(new StoryPlaceholder());
  }

  openPlaceholderPopover(placeholder: StoryPlaceholder) {
    this.popoverCtrl.create({
      component: PlaceholderPopover,
      componentProps: {
        placeholder: placeholder
      }
    }).then(popover => {
      popover.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          this.saving = true;
          this.backendService.saveStoryPlaceholder(dataReturned.data).subscribe(data => {
            this.saving = false;
            let idx = this.placeholders.findIndex(p => p.id === data.id);
            if (idx >= 0) {
              this.placeholders[idx] = data;
            } else {
              this.placeholders.push(data);
            }
          }, () => this.saving = false);
        }
      });
      popover.present();
    });
  }

  openPicSelection(story: Story, side: string) {
    this.popoverCtrl.create({
      component: StoryPicSelectionPopover,
      componentProps: {
        side: side
      }
    }).then(p => {
      p.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          if (side === 'left') {
            if (dataReturned.data === 'NONE') {
              story.leftPic = null;
            } else {
              story.leftPic = dataReturned.data;
            }
          } else {
            if (dataReturned.data === 'NONE') {
              story.rightPic = null;
            } else {
              story.rightPic = dataReturned.data;
            }
          }
          this.storyModified(story);
        }
      });
      p.present();
    });
  }

  storyTriggerChanged() {
    if (this.storyTrigger) {
      this.saving = true;
      this.stories = [];
      this.backendService.loadStory(this.storyTrigger).subscribe(data => {
        this.stories = data;
        if (this.stories && this.stories.length > 0) {
          this.lootBoxId = this.stories[0].lootBoxId;
        } else {
          this.lootBoxId = null;
        }
        this.storiesToDelete = [];
        this.saving = false;
      }, () => this.saving = false);
    }
  }

  newStory() {
    let newStory = new Story();
    newStory.trigger = this.storyTrigger;
    newStory.number = this.stories.length + 1;
    newStory.message = "Story mandatory";
    newStory.buttonText = "Next";
    newStory.dirty = true;
    this.stories.push(newStory);
  }

  deleteStory(story: Story) {
    if (story.id) {
      this.storiesToDelete.push(story);
    }
    let idx = this.stories.findIndex(s => s.number === story.number);
    this.stories.splice(idx, 1);
    this.stories.filter(s => s.number > story.number).forEach(s => s.number--);
  }

  moveStoryUp(story: Story) {
    if (story.number > 1) {
      let swapWith = this.stories.find(s => s.number === (story.number - 1));
      swapWith.number ++;
      story.number --;
      this.storyModified(swapWith);
      this.storyModified(story);
    }
    this.stories = this.stories.sort((a, b) => a.number - b.number);
  }

  changeTitle(story: Story, event) {
    if (story.title !== event.detail.value) {
      story.title = event.detail.value;
      story.dirty = true;
    }
  }

  changeMessage(story: Story, event) {
    if (story.message !== event.detail.value) {
      story.message = event.detail.value;
      story.dirty = true;
    }
  }

  changeButtonText(story: Story, event) {
    if (story.buttonText !== event.detail.value) {
      story.buttonText = event.detail.value;
      story.dirty = true;
    }
  }

  storyModified(story: Story) {
    story.dirty = true;
  }

  saveStoryLine() {
    this.saving = true;
    if (this.stories && this.stories.length > 0) {
      this.stories[0].lootBoxId = this.lootBoxId;
    }
    this.backendService.saveStoryLine(this.stories, this.lootBoxId, this.storiesToDelete.map(s => s.id)).subscribe(data => {
      this.stories = data;
      this.storiesToDelete = [];
      this.saving = false;
    }, () => this.saving = false);
  }

}

