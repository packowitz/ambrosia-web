import {HeroSkillLevel} from './heroSkillLevel.model';
import {HeroSkillAction} from './heroSkillAction.model';

export class HeroSkill {
    id?: number;
    number: number;
    name: number;
    passive: boolean;
    passiveSkillTrigger?: string;
    passiveSkillTriggerValue?: number;
    skillActiveTrigger: string;
    initCooldown: number;
    cooldown: number;
    target: string;
    description: string;
    maxLevel: number;
    skillLevel: HeroSkillLevel[];
    actions: HeroSkillAction[];
}