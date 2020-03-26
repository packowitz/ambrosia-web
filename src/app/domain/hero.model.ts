import {HeroBase} from './herobase.model';
import {Gear} from './gear.model';
import {HeroGearSet} from './heroGearSet.model';

export class Hero {
    id: number;
    playerId: number;
    missionId: number;
    heroBase: HeroBase;
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
    weapon?: Gear;
    shield?: Gear;
    helmet?: Gear;
    armor?: Gear;
    pants?: Gear;
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

    strengthAbsBonus: number;
    strengthPercBonus: number;
    hpAbsBonus: number;
    hpPercBonus: number;
    armorAbsBonus: number;
    armorPercBonus: number;
    initiativeBonus: number;
    critBonus: number;
    critMultBonus: number;
    dexterityBonus: number;
    resistanceBonus: number;

    lifesteal: number;
    counterChance: number;
    reflect: number;
    evasionChance: number;
    speedBarFilling: number;
    armorPiercing: number;
    armorExtraDmg: number;
    healthExtraDmg: number;
    redDamageInc: number;
    greenDamageInc: number;
    blueDamageInc: number;
    healingInc: number;
    superCritChance: number;
    buffIntensityInc: number;
    debuffIntensityInc: number;
}