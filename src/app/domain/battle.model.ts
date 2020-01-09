import {BattleHero} from './battleHero.model';
import {BattleStep} from './battleStep.model';
import {Dungeon} from './dungeon.model';

export class Battle {
    id: number;
    type: string;
    status: string;
    previousBattleId?: number;
    nextBattleId?: number;
    dungeon?: Dungeon;
    dungeonStage?: number;
    mapId?: number;
    mapPosX?: number;
    mapPosY?: number;
    playerId: number;
    playerName: number;
    opponentId: number;
    opponentName: number;
    started: string;
    lastAction: string;
    activeHero: string;
    turnsDone: number;
    hero1?: BattleHero;
    hero2?: BattleHero;
    hero3?: BattleHero;
    hero4?: BattleHero;
    oppHero1?: BattleHero;
    oppHero2?: BattleHero;
    oppHero3?: BattleHero;
    oppHero4: BattleHero;
    steps: BattleStep[];
}