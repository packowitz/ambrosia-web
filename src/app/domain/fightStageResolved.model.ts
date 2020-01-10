import {Hero} from './hero.model';

export class FightStageResolved {
    id: number;
    stage: number;
    hero1?: Hero;
    hero2?: Hero;
    hero3?: Hero;
    hero4?: Hero;
}