import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeroBase} from '../domain/herobase.model';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {EnumService} from '../services/enum.service';
import {HeroSkill} from '../domain/heroSkill.model';
import {HeroSkillLevel} from '../domain/heroSkillLevel.model';
import {HeroSkillAction} from '../domain/heroSkillAction.model';

@Component({
    selector: 'herobase-edit',
    templateUrl: 'herobase-edit.page.html'
})
export class HerobaseEditPage implements OnInit {

    hero: HeroBase;
    skill: HeroSkill;
    saving = false;

    constructor(private route: ActivatedRoute,
                private backendService: BackendService,
                private converter: ConverterService,
                private enumService: EnumService) {}

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
        });
    }

    setSkill(event) {
        if (event.detail.value === 'add') {
            this.addNewSkill();
        } else {
            let selected = Number(event.detail.value);
            this.skill = this.hero.skills.find(s => s.number === selected);
        }
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

    addSkillAction(skill: HeroSkill) {
        let action = new HeroSkillAction();
        action.position = skill.actions.length + 1;
        skill.actions.push(action);
    }
}