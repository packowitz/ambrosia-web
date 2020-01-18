import {Player} from './player.model';
import {FightStageResolved} from './fightStageResolved.model';
import {FightStageConfig} from './fightStageConfig.model';
import {FightEnvironment} from './fightEnvironment.model';

export class FightResolved {
    id: number;
    name: string;
    serviceAccount: Player;
    stages: FightStageResolved[];
    stageConfig: FightStageConfig;
    environment: FightEnvironment;
}