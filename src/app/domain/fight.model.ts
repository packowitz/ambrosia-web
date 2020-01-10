import {FightStage} from './fightStage.model';

export class Fight {
    id: number;
    name: string;
    serviceAccountId: number;
    stages: FightStage[];
}