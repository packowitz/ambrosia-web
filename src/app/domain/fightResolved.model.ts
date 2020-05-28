import {Player} from './player.model';
import {FightStageResolved} from './fightStageResolved.model';
import {FightStageConfig} from './fightStageConfig.model';
import {FightEnvironment} from './fightEnvironment.model';
import {LootBox} from './lootBox.model';

export class FightResolved {
    id: number;
    name: string;
    description: string;
    serviceAccount: Player;
    resourceType: string;
    costs: number;
    xp: number;
    level: number;
    ascPoints: number;
    travelDuration: number;
    timePerTurn: number;
    maxTurnsPerStage: number;
    stages: FightStageResolved[];
    stageConfig: FightStageConfig;
    environment: FightEnvironment;
    lootBox: LootBox;
}