import {Gear} from './gear.model';
import {HeroGearSet} from './heroGearSet.model';

export class Hero {
    id: number;
    playerId: number;
    missionId: number;
    playerExpeditionId: number;
    heroBaseId: number;
    name: string;
    color: string;
    avatar: string;
    stars: number;
    level: number;
    xp: number;
    maxXp: number;
    skill1: number;
    skill2: number;
    skill3: number;
    skill4: number;
    skill5: number;
    skill6: number;
    skill7: number;
    skillPoints: number;
    ascLvl: number;
    ascPoints: number;
    ascPointsMax: number;
    markedAsBoss: boolean;
    weapon?: Gear;
    shield?: Gear;
    helmet?: Gear;
    armor?: Gear;
    gloves?: Gear;
    boots?: Gear;
    baseStrength: number;
    baseHp: number;
    baseArmor: number;
    baseInitiative: number;
    baseCrit: number;
    baseCritMult: number;
    baseDexterity: number;
    baseResistance: number;

    strengthTotal: number;
    hpTotal: number;
    armorTotal: number;
    initiativeTotal: number;
    critTotal: number;
    critMultTotal: number;
    dexterityTotal: number;
    resistanceTotal: number;

    sets: HeroGearSet[];
}