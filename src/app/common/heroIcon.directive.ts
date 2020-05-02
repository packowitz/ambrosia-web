import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Hero} from '../domain/hero.model';
import {PopoverController} from '@ionic/angular';
import {HeroInfoPopup} from './heroInfo.popup';

@Component({
    selector: 'hero-icon',
    template: `
      <div *ngIf="hero" (click)="selectHero(hero)" class="hero-tile-small border-grey flex-vert-center mr-2" [class.pointer]="isClickable(hero)" [class.selected-tile]="selected">
        <ion-img [src]="'assets/icon/chars/' + hero.heroBase.avatar + '.png'" class="hero-avatar-small border-bottom-grey"></ion-img>
        <div *ngIf="showOnMission && hero.missionId" class="on-mission flex-vert-center">
          <div class="text">On Mission</div>
        </div>
        <div class="top-left-bubble level-bubble background-{{hero.heroBase.color}}">{{hero.level}}</div>
        <ion-img *ngIf="showInfo" class="top-right-bubble resource-icon pointer" (click)="info(hero, $event)" src="assets/icon/info.png"></ion-img>
        <ion-img [src]="'assets/img/star_' + hero.stars + '.png'" class="hero-stars"></ion-img>
      </div>
      <div *ngIf="!hero" class="hero-tile-small border-grey">
        <ion-img src="assets/icon/chars/placeholder.png" class="hero-avatar-small"></ion-img>
      </div>
  `
})
export class HeroIconDirective {
    @Input() hero: Hero;
    @Input() selected = false;
    @Input() clickable = false;
    @Input() showOnMission = true;
    @Input() clickableOnMission = false;
    @Input() showInfo = true;
    @Output() clicked = new EventEmitter();

    constructor(private popoverCtrl: PopoverController) {}

    isClickable(hero: Hero): boolean {
        if (this.clickable) {
            if (!this.clickableOnMission) {
                return !hero.missionId;
            }
            return true;
        }
        return false;
    }

    selectHero(hero: Hero) {
        if (this.isClickable(hero)) {
            this.clicked.emit(this.hero);
        }
    }

    info(hero: Hero, event: Event) {
        event.stopPropagation();
        this.popoverCtrl.create({
            component: HeroInfoPopup,
            cssClass: 'widePopover',
            componentProps: {
                hero: hero
            }
        }).then(p => p.present());
    }
}
