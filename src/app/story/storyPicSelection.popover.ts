import {Component} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Hero} from '../domain/hero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {StoryPlaceholder} from '../domain/storyPlaceholder.model';

@Component({
    selector: 'story-pic-selection-popover',
    template: `
        <div class="ma-2">
          <div class="scrollable-list">
            <ion-img *ngFor="let pic of pics()" src="assets/icon/story/{{pic}}.png" class="story-pic pointer mr-1" (click)="close(pic)"></ion-img>
          </div>
        </div>
    `
})
export class StoryPicSelectionPopover {

    left = true;

    leftPics = ["NONE", "PROF_LEFT", "HERO4_LEFT___COLOR__", "HERO3___COLOR__", "HERO2_LEFT___COLOR__"];
    rightPics = ["NONE", "PROF_RIGHT", "HERO4_RIGHT___COLOR__", "HERO3___COLOR__", "HERO2_RIGHT___COLOR__"];

    constructor(private popoverController: PopoverController,
                private navParams: NavParams) {
        this.left = navParams.get('side') === 'left';
    }

    pics(): string[] {
        return this.left ? this.leftPics : this.rightPics;
    }

    close(pic?: string) {
        this.popoverController.dismiss(pic);
    }
}