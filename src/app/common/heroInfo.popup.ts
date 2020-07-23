import {Component} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Hero} from '../domain/hero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {HeroBase} from '../domain/herobase.model';
import {Model} from '../services/model.service';

@Component({
    selector: 'hero-info-popup',
    template: `
        <div class="ma-2">
          <div class="flex-space-between">
            <div class="flex-start"><div [class]="heroBase.color">{{heroBase.name}}</div>, Lvl {{hero.level}}</div>
            <ion-icon name="close" class="pointer" (click)="close()"></ion-icon>
          </div>
          
          <div class="mt-2 flex-start font-small">
            <div class="hero-tile-smaller border-grey flex-vert-center mr-2">
              <ion-img [src]="'assets/icon/chars/' + heroBase.avatar + '.png'" class="border-bottom-grey"></ion-img>
              <ion-img [src]="'assets/img/star_' + hero.stars + '.png'" class="hero-stars"></ion-img>
            </div>
            <div class="flex-vert-space-between-start height70 full-width">
              <div>{{heroBase.heroClass}}, <i>{{heroBase.heroType}}</i></div>
              <div class="flex-start full-width">
                <div class="width-60">XP</div>
                <div class="flex-grow bar-outer with-text xp">
                  <span class="bar-filled" [style.width]="(100 * hero.xp / hero.maxXp) + '%'"></span>
                  <span class="bar-text">{{hero.xp == hero.maxXp ? 'MAX' : hero.xp + ' / ' + hero.maxXp}}</span>
                </div>
              </div>
              <div class="flex-start full-width">
                <div class="width-60">Asc {{hero.ascLvl}}</div>
                <div class="flex-grow bar-outer with-text asc">
                  <span class="bar-filled" [style.width]="(100 * hero.ascPoints / hero.ascPointsMax) + '%'"></span>
                  <span class="bar-text">{{hero.ascPoints == hero.ascPointsMax ? 'MAX' : hero.ascPoints + ' / ' + hero.ascPointsMax}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-space-between">
            <ion-button [fill]="tab == 'stats' ? 'outline' : 'clear'" size="small" (click)="tab = 'stats'" color="dark">Stats</ion-button>
            <ion-button [fill]="tab == 'skills' ? 'outline' : 'clear'" size="small" (click)="tab = 'skills'" color="dark">Skills</ion-button>
            <ion-button [fill]="tab == 'gear' ? 'outline' : 'clear'" size="small" (click)="tab = 'gear'" color="dark">Gear</ion-button>
          </div>
          
          <div *ngIf="tab == 'stats'" class="font-small no-wrap">
            <ion-row>
              <ion-col sizeMd="6">
                <ion-row>
                  <ion-col sizeMd="6">Strength</ion-col>
                  <ion-col sizeMd="6">{{hero.baseStrength}} <strong *ngIf="hero.strengthTotal > hero.baseStrength" class="color-green">+{{hero.strengthTotal - hero.baseStrength}}</strong></ion-col>
                </ion-row>
                <ion-row>
                  <ion-col sizeMd="6">Hitpoints</ion-col>
                  <ion-col sizeMd="6">{{hero.baseHp}} <strong *ngIf="hero.hpTotal > hero.baseHp" class="color-green">+{{hero.hpTotal - hero.baseHp}}</strong></ion-col>
                </ion-row>
                <ion-row>
                  <ion-col sizeMd="6">Armor</ion-col>
                  <ion-col sizeMd="6">{{hero.baseArmor}} <strong *ngIf="hero.armorTotal > hero.baseArmor" class="color-green">+{{hero.armorTotal - hero.baseArmor}}</strong></ion-col>
                </ion-row>
                <ion-row>
                  <ion-col sizeMd="6">Initiative</ion-col>
                  <ion-col sizeMd="6">{{hero.baseInitiative}} <strong *ngIf="hero.initiativeTotal > hero.baseInitiative" class="color-green">+{{hero.initiativeTotal - hero.baseInitiative}}</strong></ion-col>
                </ion-row>
              </ion-col>
              <ion-col sizeMd="6">
                <ion-row>
                  <ion-col sizeMd="6">Dexterity</ion-col>
                  <ion-col sizeMd="6">{{hero.baseDexterity}} <strong *ngIf="hero.dexterityTotal > hero.baseDexterity" class="color-green">+{{hero.dexterityTotal - hero.baseDexterity}}</strong></ion-col>
                </ion-row>
                <ion-row>
                  <ion-col sizeMd="6">Resistance</ion-col>
                  <ion-col sizeMd="6">{{hero.baseResistance}} <strong *ngIf="hero.resistanceTotal > hero.baseResistance" class="color-green">+{{hero.resistanceTotal - hero.baseResistance}}</strong></ion-col>
                </ion-row>
                <ion-row>
                  <ion-col sizeMd="6">Crit</ion-col>
                  <ion-col sizeMd="6">{{hero.baseCrit}} <strong *ngIf="hero.critTotal > hero.baseCrit" class="color-green">+{{hero.critTotal - hero.baseCrit}}</strong></ion-col>
                </ion-row>
                <ion-row>
                  <ion-col sizeMd="6">CritMult</ion-col>
                  <ion-col sizeMd="6">{{hero.baseCritMult}} <strong *ngIf="hero.critMultTotal > hero.baseCritMult" class="color-green">+{{hero.critMultTotal - hero.baseCritMult}}</strong></ion-col>
                </ion-row>
              </ion-col>
            </ion-row>
          </div>

          <div *ngIf="tab == 'skills'" class="font-small">
            <div class="flex-start">
              <div *ngFor="let heroSkill of getSkills()" (click)="skill = heroSkill" class="skill-tile flex-vert-center pointer mr-2" [class.selected-skill]="heroSkill == skill">
                <ion-img [src]="'assets/icon/skills/' + heroSkill.icon + '.png'" class="skill_icon"></ion-img>
                <div *ngIf="getSkillLevel(heroSkill) > 0" class="skill-level">{{getSkillLevel(heroSkill)}}</div>
                <div *ngIf="getSkillLevel(heroSkill) == 0" class="locked"><ion-icon name="lock-closed"></ion-icon></div>
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
                <div *ngFor="let lvl of skill.skillLevel" [class.strong]="getSkillLevel(skill) >= lvl.level">L{{lvl.level}} {{lvl.description}}</div>
              </div>
            </div>
          </div>

          <div *ngIf="tab == 'gear'">
            <ion-item><gear-list-item type="WEAPON" [hero]="hero" [gear]="hero.weapon" [readonly]="true" class="full-width"></gear-list-item></ion-item>
            <ion-item><gear-list-item type="SHIELD" [hero]="hero" [gear]="hero.shield" [readonly]="true" class="full-width"></gear-list-item></ion-item>
            <ion-item><gear-list-item type="HELMET" [hero]="hero" [gear]="hero.helmet" [readonly]="true" class="full-width"></gear-list-item></ion-item>
            <ion-item><gear-list-item type="ARMOR" [hero]="hero" [gear]="hero.armor" [readonly]="true" class="full-width"></gear-list-item></ion-item>
            <ion-item><gear-list-item type="GLOVES" [hero]="hero" [gear]="hero.gloves" [readonly]="true" class="full-width"></gear-list-item></ion-item>
            <ion-item><gear-list-item type="BOOTS" [hero]="hero" [gear]="hero.boots" [readonly]="true" class="full-width"></gear-list-item></ion-item>
          </div>
        </div>
    `
})
export class HeroInfoPopup {

    hero: Hero;
    heroBase: HeroBase;
    tab = "stats";
    
    skill: HeroSkill;

    constructor(private model: Model,
                private popoverController: PopoverController,
                private navParams: NavParams) {
        this.hero = navParams.get('hero');
        this.heroBase = this.model.getHeroBase(this.hero.heroBaseId);
        this.skill = this.heroBase.skills[0];
    }

    close() {
        this.popoverController.dismiss();
    }

    getSkills(): HeroSkill[] {
        return this.heroBase.skills.filter(s => s.skillActiveTrigger !== 'NPC_ONLY' || this.getSkillLevel(s) > 0);
    }

    getSkillLevel(skill: HeroSkill): number {
        return this.hero['skill' + skill.number] || 0;
    }
}