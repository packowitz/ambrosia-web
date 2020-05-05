import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {HeroSkill} from '../domain/heroSkill.model';
import {HeroBase} from '../domain/herobase.model';

export class HeroAndSkill {
    hero: HeroBase;
    skill: HeroSkill;


    constructor(hero: HeroBase, skill: HeroSkill) {
        this.hero = hero;
        this.skill = skill;
    }
}

@Component({
    selector: 'new-skill-modal',
    template: `
        <div class="ma-2">
          <div class="flex-space-between">
            <ion-item class="flex-grow">
              <ion-label position="floating">Skill Name</ion-label>
              <ion-input [(ngModel)]="skillName" (ionChange)="autocomplete()" (keyup.enter)="emptySkill()" autofocus="true"></ion-input>
            </ion-item>
            <ion-button fill="outline" size="small" color="success" (click)="emptySkill()" class="ml-2 mr-2">OK</ion-button>
            <ion-icon name="close" class="pointer" (click)="close()"></ion-icon>
          </div>
          <ion-list>
            <ion-list-header *ngIf="skills.length > 0">
              Select an existing skill to copy
            </ion-list-header>
            <ion-item *ngFor="let skill of skills" (click)="close(skill.skill)" class="pointer">
              <ion-img src="assets/icon/skills/{{skill.skill.icon}}.png" class="skill_icon mr-1"></ion-img>
              {{skill.skill.name}}
              <i *ngIf="skill.skill.passive">, passive</i>
              &nbsp;({{skill.hero.name}}, S{{skill.skill.number}})
            </ion-item>
          </ion-list>
        </div>
    `
})
export class NewSkillModal {

    skillName = "";

    skills: HeroAndSkill[] = [];

    constructor(private modalController: ModalController,
                private model: Model) {
    }

    emptySkill() {
        let emptySkill = new HeroSkill();
        emptySkill.name = this.skillName;
        emptySkill.icon = 'default';
        emptySkill.initCooldown = 0;
        emptySkill.cooldown = 0;
        emptySkill.skillActiveTrigger = 'ALWAYS';
        emptySkill.target = 'OPPONENT';
        emptySkill.maxLevel = 1;
        emptySkill.skillLevel = [];
        emptySkill.actions = [];
        this.close(emptySkill);
    }

    autocomplete() {
        let skills = [];
        let term = this.skillName.trim().toLowerCase();
        if (term.length > 0) {
            this.model.baseHeroes.forEach( baseHero => {
                if (baseHero.name.toLowerCase().indexOf(term) >=0 || baseHero.heroClass.toLowerCase().indexOf(term) >= 0) {
                    baseHero.skills.forEach(s => skills.push(new HeroAndSkill(baseHero, s)));
                } else {
                    baseHero.skills.forEach(s => {
                        if (s.name.toLowerCase().indexOf(term) >= 0) {
                            skills.push(new HeroAndSkill(baseHero, s));
                        }
                    });
                }
            });
        }
        this.skills = skills.slice(0, 10);
    }

    close(skill?: HeroSkill) {
        this.modalController.dismiss(skill);
    }
}