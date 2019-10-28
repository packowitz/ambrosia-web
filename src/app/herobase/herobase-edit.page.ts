import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeroBase} from '../domain/herobase.model';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {EnumService, SkillActionEffect} from '../services/enum.service';
import {HeroSkill} from '../domain/heroSkill.model';
import {HeroSkillLevel} from '../domain/heroSkillLevel.model';
import {HeroSkillAction} from '../domain/heroSkillAction.model';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'herobase-edit',
    templateUrl: 'herobase-edit.page.html'
})
export class HerobaseEditPage implements OnInit {

    hero: HeroBase;
    skill: HeroSkill;
    saving = false;

    skillActionsExpanded = 0;

    constructor(private route: ActivatedRoute,
                private backendService: BackendService,
                private converter: ConverterService,
                private enumService: EnumService,
                private alertCtrl: AlertController) {}

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.backendService.getHeroBase(id).subscribe(data => {
            this.hero = data;
            if(this.hero.skills.length === 0) {
                this.addNewSkill();
            } else {
                this.skill = this.hero.skills[0];
            }
        });
    }

    recruit() {
        this.saving = true;
        this.backendService.recruitHero(this.hero).subscribe(data => {
            // forward to hero page
            this.saving = false;
        });
    }

    counter(i: number) {
        return new Array(i);
    }

    addNewSkill() {
        let newSkill = new HeroSkill();
        newSkill.number = this.hero.skills.length + 1;
        newSkill.initCooldown = 0;
        newSkill.cooldown = 0;
        newSkill.skillActiveTrigger = 'ALWAYS';
        newSkill.target = 'OPPONENT';
        newSkill.maxLevel = 1;
        newSkill.skillLevel = [];
        newSkill.actions = [];
        this.hero.skills.push(newSkill);
        this.skill = newSkill;
    }

    editHero() {
        this.saving = true;
        this.backendService.saveHeroBase(this.hero).subscribe(data => {
            this.hero = data;
            this.saving = false;
        }, error => {
            this.saving = false;
            this.alertCtrl.create({
                header: 'Save failed',
                message: error.error.message,
                buttons: [{text: 'Okay'}]
            }).then(data => data.present());
        });
    }

    setSkill(event) {
        if (event.detail.value === 'add') {
            this.addNewSkill();
        } else {
            let selected = Number(event.detail.value);
            this.skill = this.hero.skills.find(s => s.number === selected);
        }
        this.skillActionsExpanded = 0;
    }

    skillMaxLevelChanged(skill: HeroSkill, event) {
        let maxSkill = Number(event.detail.value);
        let i;
        for(i = 2; i <= maxSkill; i++) {
            if(!skill.skillLevel.find(lvl => lvl.level === i)) {
                let newSkillLevel = new HeroSkillLevel();
                newSkillLevel.level = i;
                skill.skillLevel.push(newSkillLevel);
            }
        }
        if (skill.skillLevel.length > maxSkill - 1) {
            skill.skillLevel = skill.skillLevel.slice(0, maxSkill - 1);
        }
    }

    getSkillActionEffects(action: HeroSkillAction): SkillActionEffect[] {
        return this.enumService.getSkillActionEffects().filter(e => e.type === action.type);
    }

    skillActionChanged(action: HeroSkillAction) {
        action.effect = null;
    }

    getSkillActionEffectDescription(action: HeroSkillAction): string {
        return this.enumService.getSkillActionEffects().find(e => e.name === action.effect).description;
    }

    addSkillAction(skill: HeroSkill) {
        let action = new HeroSkillAction();
        action.position = skill.actions.length + 1;
        skill.actions.push(action);
        this.skillActionsExpanded = action.position;
    }

    toggleExpandAction(position: number) {
        if (this.skillActionsExpanded === position) {
            this.skillActionsExpanded = 0;
        } else {
            this.skillActionsExpanded = position;
        }
    }

    moveAction(action: HeroSkillAction, move: number) {
        let newPos = action.position + move;
        if (newPos >= 1 && newPos <= this.skill.actions.length) {
            let oldPos = action.position;
            this.skill.actions.find(a => a.position === newPos).position = oldPos;
            action.position = newPos;
            this.skill.actions.sort((a, b) => a.position - b.position);
            if (this.skillActionsExpanded === oldPos) {
                this.skillActionsExpanded = newPos;
            } else if (this.skillActionsExpanded === newPos) {
                this.skillActionsExpanded = oldPos;
            }
        }
    }

    dropAction(action: HeroSkillAction) {
        let idx = this.skill.actions.indexOf(action);
        this.skill.actions.filter(a => a.position > action.position).forEach(a => a.position--);
        this.skill.actions.splice(idx, 1);
    }
}