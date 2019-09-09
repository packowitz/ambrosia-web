import {HeroBase} from './herobase.model';
import {BattleHeroBuff} from './battleHeroBuff.model';

export class BattleHero {
    id: number;
    playerId: number;
    status: string;
    heroBase: HeroBase;
    position: string;
    color: string;
    level: number;
    stars: number;
    ascLvl: number;

    buffs: BattleHeroBuff[];

    skill1Lvl: number;
    skill2Lvl?: number;
    skill2Cooldown?: number;
    skill3Lvl?: number;
    skill3Cooldown?: number;
    skill4Lvl?: number;
    skill4Cooldown?: number;
    skill5Lvl?: number;
    skill5Cooldown?: number;
    skill6Lvl?: number;
    skill6Cooldown?: number;
    skill7Lvl?: number;
    skill7Cooldown?: number;

    heroStrength: number;
    strengthBonus: number;
    heroHp: number;
    heroArmor: number;
    armorBonus: number;
    heroCrit: number;
    critBonus: number;
    heroCritMult: number;
    critMultBonus: number;
    heroDexterity: number;
    dexterityBonus: number;
    heroResistance: number;
    resistanceBonus: number;

    currentHp: number;
    currentArmor: number;
    currentSpeedBar: number;

    heroLifesteal: number;
    lifestealBonus: number;
    heroCounterChance: number;
    counterChanceBonus: number;
    heroReflect: number;
    reflectBonus: number;
    heroDodgeChance: number;
    dodgeChanceBonus: number;
    heroSpeed: number;
    speedBonus: number;
    heroArmorPiercing: number;
    armorPiercingBonus: number;
    heroArmorExtraDmg: number;
    armorExtraDmgBonus: number;
    heroHealthExtraDmg: number;
    healthExtraDmgBonus: number;
    heroRedDamageInc: number;
    redDamageIncBonus: number;
    heroGreenDamageInc: number;
    greenDamageIncBonus: number;
    heroBlueDamageInc: number;
    blueDamageIncBonus: number;
    heroHealingInc: number;
    healingIncBonus: number;
    heroSuperCritChance: number;
    superCritChanceBonus: number;
    heroBuffIntensityInc: number;
    buffIntensityIncBonus: number;
    heroDebuffIntensityInc: number;
    debuffIntensityIncBonus: number;
}