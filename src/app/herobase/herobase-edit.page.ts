import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeroBase} from '../domain/herobase.model';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {EnumService, SkillActionEffect} from '../services/enum.service';
import {HeroSkill} from '../domain/heroSkill.model';
import {HeroSkillLevel} from '../domain/heroSkillLevel.model';
import {HeroSkillAction} from '../domain/heroSkillAction.model';
import {AlertController, ModalController} from '@ionic/angular';
import {SkillIconModal} from './skillIcon.modal';
import {HeroAvatarModal} from './heroavatar.modal';
import {Model} from '../services/model.service';
import {NewSkillModal} from './newSkill.modal';
import {Hero} from '../domain/hero.model';

@Component({
    selector: 'herobase-edit',
    templateUrl: 'herobase-edit.page.html'
})
export class HerobaseEditPage implements OnInit {

    heroId: number;
    hero: HeroBase;
    skill: HeroSkill;
    saving = false;

    skillActionsExpanded = 0;

    constructor(private route: ActivatedRoute,
                public model: Model,
                private backendService: BackendService,
                private converter: ConverterService,
                private enumService: EnumService,
                private alertCtrl: AlertController,
                private modalCtrl: ModalController,
                private router: Router) {}

    ngOnInit() {
        this.heroId = Number(this.route.snapshot.paramMap.get('id'));
    }

    ionViewWillEnter() {
        if (!this.model.baseHeroes) {
            this.backendService.getHeroBases().subscribe(data => {
                this.model.baseHeroes = data;
                this.setHero();
            });
        } else {
            this.setHero();
        }
    }

    setHero(hero?: HeroBase) {
        this.hero = this.converter.dataClone(hero ? hero : this.model.baseHeroes.find(h => h.id === this.heroId));
        if(this.hero.skills.length === 0) {
            this.addSkill();
        } else {
            if (this.skill) {
                this.skill = this.hero.skills.find(s => s.number === this.skill.number);
            } else {
                this.setSkill(this.hero.skills[0]);
            }
        }
    }

    recruit() {
        this.saving = true;
        this.backendService.recruitHero(this.hero).subscribe(() => {
            // forward to hero page
            this.saving = false;
        });
    }

    delete() {
        this.alertCtrl.create({
            subHeader: 'Are you sure to delete this base hero?',
            buttons: [
                {text: 'Cancel'},
                {text: 'Delete', handler: () => {
                    this.saving = true;
                    this.backendService.deleteHeroBase(this.hero.id).subscribe(() => {
                        this.saving = false;
                        let idx = this.model.baseHeroes.findIndex(h => h.id === this.hero.id);
                        if (idx >= 0) {
                            this.model.baseHeroes.splice(idx, 1);
                        }
                        this.cancel();
                    }, () => {
                        this.saving = false;
                    });
                }}
            ]
        }).then(a => a.present());
    }

    counter(i: number) {
        return new Array(i);
    }

    addNewSkill() {
        this.modalCtrl.create({
            component: NewSkillModal
        }).then(modal => {
            modal.onDidDismiss().then((dataReturned) => {
                if (dataReturned !== null && dataReturned.data) {
                    this.addSkill(dataReturned.data);
                }
            });
            modal.present();
        });
    }

    addSkill(copy?: HeroSkill) {
        let heroColor = this.hero.color.toLowerCase;
        let skillNumber = this.hero.skills.length + 1;
        let replaceSkillNr = false;
        if (!!copy && !!copy.number && copy.number !== skillNumber) {
            replaceSkillNr = true;
        }
        let newSkill = new HeroSkill();
        newSkill.number = skillNumber;
        newSkill.name = copy ? copy.name : 'Please name me';
        newSkill.description = copy ? copy.description : 'Please describe me';
        newSkill.icon = copy ? copy.icon.replace('red', heroColor).replace('blue', heroColor).replace('green', heroColor) : 'default';
        newSkill.passive = copy ? copy.passive : false;
        newSkill.passiveSkillTrigger = copy ? copy.passiveSkillTrigger : null;
        newSkill.passiveSkillTriggerValue = copy ? copy.passiveSkillTriggerValue : null;
        newSkill.initCooldown = copy ? copy.initCooldown : 0;
        newSkill.cooldown = copy ? copy.cooldown : 0;
        newSkill.skillActiveTrigger = copy ? copy.skillActiveTrigger : 'ALWAYS';
        newSkill.target = copy ? copy.target : 'OPPONENT';
        newSkill.maxLevel = copy ? copy.maxLevel : 1;
        newSkill.skillLevel = copy ? copy.skillLevel.map(c => {
            let lvl = new HeroSkillLevel();
            lvl.level = c.level;
            lvl.description = c.description;
            return lvl;
        }) : [];
        newSkill.actions = copy ? copy.actions.map(c => {
            let action = new HeroSkillAction();
            action.position = c.position;
            if (replaceSkillNr && c.trigger === 'S' + copy.number + '_LVL') {
                action.trigger = 'S' + skillNumber + '_LVL';
            } else {
                action.trigger = c.trigger;
            }
            action.triggerValue = c.triggerValue;
            action.triggerChance = c.triggerChance;
            action.type = c.type;
            action.target = c.target;
            action.effect = c.effect;
            action.effectValue = c.effectValue;
            action.effectDuration = c.effectDuration;
            return action;
        }) : [];
        this.hero.skills.push(newSkill);
        this.setSkill(newSkill);
    }

    removeSkill() {
        this.alertCtrl.create({
            subHeader: 'Are you sure to delete this skill?',
            message: 'Make sure to double all skill trigger as skill numbers will change',
            buttons: [
                {text: 'Cancel'},
                {text: 'Confirm', handler: () => {
                        let idx = this.hero.skills.indexOf(this.skill);
                        this.hero.skills.filter(s => s.number > this.skill.number).forEach(s => s.number--);
                        this.hero.skills.splice(idx, 1);
                        if (this.hero.skills.length === 0) {
                            this.addSkill();
                        } else {
                            let skillNr = this.skill.number === 1 ? 1 : this.skill.number - 1;
                            this.setSkill(this.hero.skills.find(s => s.number === skillNr));
                        }
                    }
                }
            ]
        }).then(a => a.present());
    }

    save() {
        this.saving = true;
        this.backendService.saveHeroBase(this.hero).subscribe(data => {
            this.model.updateBaseHero(data);
            this.setHero(data);
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

    cancel() {
        this.router.navigateByUrl('/herobase/list');
    }

    setSkill(skill: HeroSkill) {
        this.skill = skill;
        this.skillActionsExpanded = 0;
    }

    changeAvatar(event) {
        event.stopPropagation();
        this.modalCtrl.create({
            component: HeroAvatarModal,
            componentProps: {
                currentIcon: this.hero.avatar,
                color: this.hero.color
            }
        }).then(modal => {
            modal.onDidDismiss().then((dataReturned) => {
                if (dataReturned !== null && dataReturned.data) {
                    this.hero.avatar = dataReturned.data;
                }
            });
            modal.present();
        });
    }

    changeSkillIcon(skill: HeroSkill) {
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
        action.trigger = "S" + this.skill.number + "_LVL";
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