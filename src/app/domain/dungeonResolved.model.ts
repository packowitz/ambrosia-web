import {Player} from './player.model';
import {DungeonStageResolved} from './dungeonStageResolved.model';

export class DungeonResolved {
    id: number;
    name: string;
    serviceAccount: Player;
    stages: DungeonStageResolved[];
}