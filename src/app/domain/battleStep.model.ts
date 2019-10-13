import {BattleStepAction} from './battleStepAction.model';

export class BattleStep {
    id: number;
    turn: number;
    phase: string;
    actingHero: string;
    usedSkill?: number;
    target: string;
    actions: BattleStepAction[];

    expanded?: boolean;
}