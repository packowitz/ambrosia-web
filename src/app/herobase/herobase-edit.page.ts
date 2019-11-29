import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeroBase} from '../domain/herobase.model';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {EnumService, SkillActionEffect} from '../services/enum.service';
import {HeroSkill} from '../domain/heroSkill.model';
import {HeroSkillLevel} from '../domain/heroSkillLevel.model';
import {HeroSkillAction} from '../domain/heroSkillAction.model';
import {AlertController, ModalController} from '@ionic/angular';
import {SkillIconModal} from './skillIcon.modal';

@Component({
    selector: 'herobase-edit',
    templateUrl: 'herobase-edit.page.html'
})
export class HerobaseEditPage implements OnInit {

    hero: HeroBase;
    skill: HeroSkill;
    selectedSkill = 1;
    saving = false;

    skillActionsExpanded = 0;

    constructor(private route: ActivatedRoute,
                private backendService: BackendService,
                private converter: ConverterService,
                private enumService: EnumService,
                private alertCtrl: AlertController,
                private modalCtrl: ModalController) {}

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.backendService.getHeroBase(id).subscribe(data => {
            this.hero = data;
            if(this.hero.skills.length === 0) {
                this.addNewSkill();
            } else {
                this.selectedSkill = 1;
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
        newSkill.icon = 'default';
        newSkill.initCooldown = 0;
        newSkill.cooldown = 0;
        newSkill.skillActiveTrigger = 'ALWAYS';
        newSkill.target = 'OPPONENT';
        newSkill.maxLevel = 1;
        newSkill.skillLevel = [];
        newSkill.actions = [];
        this.hero.skills.push(newSkill);
        this.selectedSkill = newSkill.number;
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
            this.selectedSkill = Number(event.detail.value);
        }
        this.skillActionsExpanded = 0;
    }

    changeSkillIcon(event, skill) {
        event.stopPropagation();
        this.modalCtrl.create({
            component: SkillIconModal,
            componentProps: {
                currentIcon: skill.icon,
                color: this.hero.color
            }
        }).then(modal => {
            modal.onDidDismiss().then((dataReturned) => {
                if (dataReturned !== null && dataReturned.data) {
                    skill.icon = dataReturned.data;
                }
            });
            modal.present();
        });
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

    getSelectedSkill(): HeroSkill {
        return this.hero.skills.find(s => s.number === this.selectedSkill);
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
        action.trigger = "S" + this.selectedSkill + "_LVL";
        action.triggerChance = 100;
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
        let skill = this.getSelectedSkill();
        let newPos = action.position + move;
        if (newPos >= 1 && newPos <= skill.actions.length) {
            let oldPos = action.position;
            skill.actions.find(a => a.position === newPos).position = oldPos;
            action.position = newPos;
            skill.actions.sort((a, b) => a.position - b.position);
            if (this.skillActionsExpanded === oldPos) {
                this.skillActionsExpanded = newPos;
            } else if (this.skillActionsExpanded === newPos) {
                this.skillActionsExpanded = oldPos;
            }
        }
    }

    dropAction(action: HeroSkillAction) {
        let skill = this.getSelectedSkill();
        let idx = skill.actions.indexOf(action);
        skill.actions.filter(a => a.position > action.position).forEach(a => a.position--);
        skill.actions.splice(idx, 1);
    }
}