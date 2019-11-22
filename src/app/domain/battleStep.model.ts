import {BattleStepAction} from './battleStepAction.model';
import {BattleStepHeroState} from './battleStepHeroState.model';

export class BattleStep {
    id: number;
    turn: number;
    phase: string;
    actingHero: string;
    actingHeroName: string;
    usedSkill?: number;
    usedSkillName?: string;
    target: string;
    targetName: string;
    actions: BattleStepAction[];
    heroStates: BattleStepHeroState[];

    expanded?: boolean;
}