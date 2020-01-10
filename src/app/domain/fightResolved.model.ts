import {Player} from './player.model';
import {FightStageResolved} from './fightStageResolved.model';

export class FightResolved {
    id: number;
    name: string;
    serviceAccount: Player;
    stages: FightStageResolved[];
}