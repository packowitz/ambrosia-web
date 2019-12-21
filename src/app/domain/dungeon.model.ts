import {DungeonStage} from './dungeonStage.model';

export class Dungeon {
    id: number;
    name: string;
    serviceAccountId: number;
    stages: DungeonStage[];
}