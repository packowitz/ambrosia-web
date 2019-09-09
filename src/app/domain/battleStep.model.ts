import {BattleStepAction} from './battleStepAction.model';

export class BattleStep {
    id: number;
    turn: number;
    actingHero: string;
    usedSkill: number;
    target: string;
    actions: BattleStepAction[];
}