import {FightStage} from './fightStage.model';
import {FightStageConfig} from './fightStageConfig.model';
import {FightEnvironment} from './fightEnvironment.model';

export class Fight {
    id: number;
    name: string;
    serviceAccountId: number;
    resourceType: string;
    costs: number;
    stageConfig: FightStageConfig;
    environment: FightEnvironment;
    stages: FightStage[];
}