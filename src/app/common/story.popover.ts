import {Component} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Hero} from '../domain/hero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {Story} from '../domain/story.model';

@Component({
    selector: 'story-popover',
    template: `
        <div class="ma-2">
          <div class="flex-space-between">
            <div class="story-pic-wrapper">
              <ion-img *ngIf="story?.leftPic" src="assets/icon/story/{{story?.leftPic}}.png" class="story-pic"></ion-img>
            </div>
            <div class="flex-vert flex-grow story-text-block">
              <div *ngIf="story?.title" class="bold">{{story?.title}}</div>
              <div class="flex-grow">{{story?.message}}</div>
              <div class="flex-end">
                <ion-button color="dark" size="small" fill="clear" (click)="next()">{{story?.buttonText}}</ion-button>
              </div>
            </div>
            <div class="story-pic-wrapper">
              <ion-img *ngIf="story?.rightPic" src="assets/icon/story/{{story?.rightPic}}.png" class="story-pic"></ion-img>
            </div>
          </div>
        </div>
    `
})
export class StoryPopover {

    stories: Story[];
    story: Story;

    constructor(private popoverController: PopoverController,
                private navParams: NavParams) {
        this.stories = navParams.get('stories');
        if (!this.stories || this.stories.length === 0) {
            this.close();
        } else {
            this.story = this.stories[0];
        }
    }

    next() {
        this.story = this.stories.find(s => s.number === (this.story.number + 1));
        if (!this.story) {
            this.close();
        }
    }

    close() {
        this.popoverController.dismiss();
    }
}