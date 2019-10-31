import {BattleStepHeroStateBuff} from './battleStepHeroStateBuff.model';

export class BattleStepHeroState {
    id: number;
    position: string;
    status: string;
    hpPerc: number;
    armorPerc: number;
    speedbarPerc: number;

    buffs: BattleStepHeroStateBuff[];
}