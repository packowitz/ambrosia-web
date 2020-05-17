import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController, PopoverController} from '@ionic/angular';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {EnumService, JewelType} from '../services/enum.service';
import {Gear} from '../domain/gear.model';
import {PropertyService} from '../services/property.service';
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

  stories: Story[];

  constructor(public model: Model,
              public enumService: EnumService,
              private backendService: BackendService,
              private popoverCtrl: PopoverController) {}

  ngOnInit(): void {
    this.backendService.getStoryPlaceholder().subscribe(data => {
      this.placeholders = data;
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
    }).then(p => {
      p.onDidDismiss().then((dataReturned) => {
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
      p.present();
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
        this.saving = false;
      }, () => this.saving = false);
    }
  }

  newStory() {
    let newStory = new Story();
    newStory.number = this.stories.length + 1;
    newStory.message = "Story mandatory";
    newStory.buttonText = "Next";
    this.stories.push(newStory);
  }

  deleteStory(story: Story) {
    if (!story.id) {
      let idx = this.stories.findIndex(s => s.number === story.number);
      this.stories.splice(idx, 1);
      this.stories.filter(s => s.number > story.number).forEach(s => s.number--);

    } else {
      this.saving = true;
      this.backendService.deleteStory(story).subscribe(() => {
        this.saving = false;
        story.id = null;
        this.deleteStory(story);
      }, () => this.saving = false);
    }
  }

  saveStory(story: Story) {
    this.saving = true;
    this.backendService.saveStory(story).subscribe(data => {
      this.saving = false;
      let idx = this.stories.findIndex(s => s.number === story.number);
      this.stories[idx] = data;
    }, () => this.saving = false);
  }

}

