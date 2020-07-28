import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {ConverterService} from '../services/converter.service';
import {BuildingService} from '../services/building.service';
import {HeroBase} from '../domain/herobase.model';
import {HeroSkill} from '../domain/heroSkill.model';

@Component({
    selector: 'hero-overview-modal',
    template: `
      <div class="ma-2 popover-scrollable" *ngIf="hero">
        <div class="flex-space-between">
          <strong>{{hero.heroClass}}</strong>
          <ion-button size="small" fill="clear" color="dark" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </div>
        <div class="flex-start">
          <div *ngFor="let heroSameClass of getHeroesOfSameClass()" class="mt-3 mr-2 pointer flex-vert-center hero-avatar-smaller position-relative" [class.border-grey]="heroSameClass.id != hero.id" [class.border-selected]="heroSameClass.id == hero.id" (click)="selectHero(heroSameClass)">
            <img src="assets/icon/chars/{{heroSameClass.avatar}}.png">
            <img src="assets/img/star_{{converter.rarityStars(heroSameClass.rarity)}}.png" class="hero-stars">
          </div>
        </div>
        <div class="mt-3">
          <div class="flex-start">
            <div class="mr-3 border-grey flex-vert-center hero-avatar position-relative">
              <img src="assets/icon/chars/{{hero.avatar}}.png">
              <img src="assets/img/star_{{converter.rarityStars(hero.rarity)}}.png" class="hero-stars">
            </div>
            <div class="full-width">
              <div class="mt-1 flex-space-between font-small">
                <div class="fake-link" (click)="maxLevel = !maxLevel">Level {{maxLevel ? 60 : 1}}</div>
                <div class="fake-link" (click)="maxAsc = !maxAsc">Asc Level {{maxAsc ? hero.maxAscLevel : 0}}</div>
              </div>
              <div class="mt-1 strong {{hero.color}}">{{hero.name}}</div>
              <div class="mt-1 flex-space-between">
                <div>
                  {{maxLevel ? hero.strengthFull : hero.strengthBase}} <strong>Strength</strong>
                </div>
                <div>
                  {{maxAsc ? hero.dexterityAsc : hero.dexterity}} <strong>Dexterity</strong>
                </div>
              </div>
              <div class="mt-1 flex-space-between">
                <div>
                  {{maxLevel ? hero.hpFull : hero.hpBase}} <strong>HP</strong>
                </div>
                <div>
                  {{maxAsc ? hero.resistanceAsc : hero.resistance}} <strong>Resistance</strong>
                </div>
              </div>
              <div class="mt-1 flex-space-between">
                <div>
                  {{maxLevel ? hero.armorFull : hero.armorBase}} <strong>Armor</strong>
                </div>
                <div>
                  {{maxAsc ? hero.critAsc : hero.crit}} <strong>Crit</strong>
                </div>
              </div>
              <div class="mt-1 flex-space-between">
                <div>
                  {{maxAsc ? hero.initiativeAsc : hero.initiative}} <strong>Initiative</strong>
                </div>
                <div>
                  {{maxAsc ? hero.critMultAsc : hero.critMult}} <strong>CritMult</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-3">
          <div class="flex-start">
            <div *ngFor="let heroSkill of getSkills()" (click)="skill = heroSkill" class="skill-tile flex-vert-center pointer mr-2" [class.border-selected]="heroSkill == skill">
              <ion-img [src]="'assets/icon/skills/' + heroSkill.icon + '.png'" class="skill_icon"></ion-img>
            </div>
          </div>
          <div *ngIf="skill">
            <div class="mt-1"><strong>{{skill.name}}</strong><i *ngIf="skill.passive"> - passive</i><i *ngIf="skill.skillActiveTrigger == 'NPC_ONLY'"> - NPC Skill</i></div>
            <div>{{skill.description}}</div>
            <div class="mt-1 flex-space-between">
              <div>{{skill.cooldown > 1 ? 'Cooldown of ' + skill.cooldown : ' '}}</div>
              <div>{{skill.initCooldown > 1 ? 'Initial Cooldown of ' + skill.initCooldown : ' '}}</div>
            </div>
            <div *ngIf="skill.skillLevel.length > 0" class="mt-1">
              <div *ngFor="let lvl of skill.skillLevel">L{{lvl.level}} {{lvl.description}}</div>
            </div>
          </div>
        </div>
      </div>
    `
})
export class HeroOverviewModal {

    hero: HeroBase;
    skill: HeroSkill;

    maxLevel = true;
    maxAsc = true;

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                public model: Model,
                public buildingService: BuildingService,
                public converter: ConverterService) {
        this.hero = navParams.get('hero');
        this.selectSkill(1);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getSkills(): HeroSkill[] {
        return this.hero.skills.filter(s => s.skillActiveTrigger !== 'NPC_ONLY');
    }

    selectSkill(number: number) {
        this.skill = this.getSkills().find(s => s.number === number);
    }

    selectHero(hero: HeroBase) {
        this.hero = hero;
        this.selectSkill(this.skill.number);
        if (!this.skill) {
            this.selectSkill(1);
        }
    }

    getHeroesOfSameClass(): HeroBase[] {
        return this.model.baseHeroes.filter(h => h.recruitable && h.heroClass === this.hero.heroClass).sort((a, b) => {
            if (a.rarity !== b.rarity) {
                return this.converter.rarityStars(a.rarity) - this.converter.rarityStars(b.rarity);
            } else {
                return this.converter.colorToSort(a.color) - this.converter.colorToSort(b.color);
            }
        });
    }
}