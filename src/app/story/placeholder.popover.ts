import {Component} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Hero} from '../domain/hero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {StoryPlaceholder} from '../domain/storyPlaceholder.model';

@Component({
    selector: 'story-placeholder-popover',
    template: `
        <div class="ma-2">
          <div class="flex-space-between">
            <div *ngIf="placeholder.id">{{placeholder.identifier}}</div>
            <div *ngIf="!placeholder.id">New Placeholder</div>
            <ion-icon name="close" class="pointer" (click)="close()"></ion-icon>
          </div>
          <div class="mt-2">
            <ion-item *ngIf="!placeholder.id">
              <ion-label class="width-50p">Placeholder</ion-label>
              <ion-input type="text" [(ngModel)]="placeholder.identifier"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="width-50p">Red Text</ion-label>
              <ion-input type="text" [(ngModel)]="placeholder.red"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="width-50p">Green Text</ion-label>
              <ion-input type="text" [(ngModel)]="placeholder.green"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="width-50p">Blue Text</ion-label>
              <ion-input type="text" [(ngModel)]="placeholder.blue"></ion-input>
            </ion-item>
            <div class="flex-end">
              <ion-button color="success" size="small" (click)="close(placeholder)" [disabled]="!placeholder.identifier || !placeholder.red || !placeholder.green || !placeholder.blue">save</ion-button>
            </div>
          </div>
        </div>
    `
})
export class PlaceholderPopover {

    placeholder: StoryPlaceholder;

    constructor(private popoverController: PopoverController,
                private navParams: NavParams) {
        this.placeholder = navParams.get('placeholder');
    }

    close(placeholder?: StoryPlaceholder) {
        this.popoverController.dismiss(placeholder);
    }
}