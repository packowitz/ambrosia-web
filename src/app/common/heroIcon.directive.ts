import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Hero} from '../domain/hero.model';
import {PopoverController} from '@ionic/angular';
import {HeroInfoPopup} from './heroInfo.popup';

@Component({
    selector: 'hero-icon',
    template: `
      <div *ngIf="hero" (click)="selectHero(hero)" class="hero-tile-small border-grey flex-vert-center" [class.pointer]="isClickable(hero)"
           [class.selected-tile]="selected">
        <img [src]="'assets/icon/chars/' + hero.heroBase.avatar + '.png'" class="border-bottom-grey">
        <div *ngIf="showBusy && (hero.missionId || hero.playerExpeditionId)" class="on-mission flex-vert-center">
          <div class="text" *ngIf="hero.missionId">On Mission</div>
          <div class="text" *ngIf="hero.playerExpeditionId">On Expedition</div>
        </div>
        <div class="top-left-bubble level-bubble background-{{hero.heroBase.color}}">{{hero.level}}</div>
        <img *ngIf="showInfo" class="top-right-bubble resource-icon pointer" (click)="info(hero, $event)" src="assets/icon/info.png">
        <img [src]="'assets/img/star_' + hero.stars + '.png'" class="hero-stars">
      </div>
      <div *ngIf="!hero" class="hero-tile-small border-grey flex-center">
        <img src="assets/icon/chars/placeholder.png">
      </div>
    `
})
export class HeroIconDirective {
    @Input() hero: Hero;
    @Input() selected = false;
    @Input() clickable = false;
    @Input() showBusy = true;
    @Input() busyClickable = false;
    @Input() showInfo = true;
    @Output() clicked = new EventEmitter();

    constructor(private popoverCtrl: PopoverController) {}

    isClickable(hero: Hero): boolean {
        if (this.clickable) {
            if (!this.busyClickable) {
                return !hero.missionId && !hero.playerExpeditionId;
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
