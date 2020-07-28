import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {HeroBase} from '../domain/herobase.model';
import {ConverterService} from '../services/converter.service';
import {ModalController} from '@ionic/angular';
import {HeroOverviewModal} from './hero-overview.modal';

@Component({
  selector: 'laboratory',
  template: `
      <div class="ma-2 popover-scrollable">
        <div class="flex-space-between">
          <strong>Heroes</strong>
          <ion-button size="small" fill="clear" color="dark" (click)="close()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </div>
        <ion-segment [(ngModel)]="selectedColor">
          <ion-segment-button value="RED">
            <ion-label class="RED">Red</ion-label>
          </ion-segment-button>
          <ion-segment-button value="GREEN">
            <ion-label class="GREEN">Green</ion-label>
          </ion-segment-button>
          <ion-segment-button value="BLUE">
            <ion-label class="BLUE">Blue</ion-label>
          </ion-segment-button>
        </ion-segment>
        
        <div class="flex-start flex-wrap">
          <div *ngFor="let hero of getHeroes()" class="mt-3 mr-2 pointer border-grey flex-vert-center hero-avatar-smaller position-relative" (click)="showHero(hero)">
            <img src="assets/icon/chars/{{hero.avatar}}.png">
            <img src="assets/img/star_{{converter.rarityStars(hero.rarity)}}.png" class="hero-stars">
            <div *ngIf="heroUnknown(hero)" class="greyed-out"></div>
          </div>
        </div>
        
      </div>
    `
})
export class HeroOverviewPage {

  knownHeroes: number[] = [];

  selectedColor = 'RED';

  constructor(private router: Router,
              public model: Model,
              public converter: ConverterService,
              public backendService: BackendService,
              private modalCtrl: ModalController,) {
    this.backendService.getKnownHeroIds().subscribe(data => this.knownHeroes = data);
  }

  close() {
    this.router.navigateByUrl('/laboratory');
  }

  getHeroes(): HeroBase[] {
    return this.model.baseHeroes.filter(h => h.recruitable && h.color === this.selectedColor).sort((a, b) => {
      if (a.rarity !== b.rarity) {
        return this.converter.rarityStars(a.rarity) - this.converter.rarityStars(b.rarity);
      } else {
        if (a.heroClass !== b.heroClass) {
          return a.heroClass < b.heroClass ? -1 : 1;
        } else {
          return a.name < b.name ? -1 : 1;
        }
      }
    });
  }

  heroUnknown(hero: HeroBase): boolean {
    return this.knownHeroes.indexOf(hero.id) === -1;
  }

  showHero(hero: HeroBase) {
    this.modalCtrl.create({
      component: HeroOverviewModal,
      componentProps: {
        hero: hero
      }
    }).then(m => m.present());
  }
}
