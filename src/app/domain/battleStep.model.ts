import {BattleStepAction} from './battleStepAction.model';
import {BattleStepHeroState} from './battleStepHeroState.model';

export class BattleStep {
    id: number;
    turn: number;
    phase: string;
    actingHero: string;
    usedSkill?: number;
    target: string;
    actions: BattleStepAction[];
    heroStates: BattleStepHeroState[];

    expanded?: boolean;
}