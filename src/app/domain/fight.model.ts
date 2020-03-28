import {FightStage} from './fightStage.model';
import {FightStageConfig} from './fightStageConfig.model';
import {FightEnvironment} from './fightEnvironment.model';
import {LootBox} from './lootBox.model';

export class Fight {
    id: number;
    name: string;
    serviceAccountId: number;
    resourceType: string;
    costs: number;
    xp: number;
    level: number;
    ascPoints: number;
    travelDuration: number;
    timePerTurn: number;
    maxTurnsPerStage: number;
    stageConfig: FightStageConfig;
    environment: FightEnvironment;
    lootBox: LootBox;
    stages: FightStage[];
}