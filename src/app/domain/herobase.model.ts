import {HeroSkill} from './heroSkill.model';

export class HeroBase {
    id: number;
    name: string;
    rarity: string;
    heroClass: string;
    color: string;
    startingHero: boolean;
    heroType: string;
    avatar: string;
    strengthBase: number;
    strengthFull: number;
    hpBase: number;
    hpFull: number;
    armorBase: number;
    armorFull: number;
    initiative: number;
    initiativeAsc: number;
    crit: number;
    critAsc: number;
    critMult: number;
    critMultAsc: number;
    dexterity: number;
    dexterityAsc: number;
    resistance: number;
    resistanceAsc: number;
    recruitable: boolean;
    maxAscLevel: number;
    skills: HeroSkill[];


    constructor(copy: HeroBase, color: string) {
        this.name = color + " " + copy.heroClass;
        this.rarity = copy.rarity;
        this.heroClass = copy.heroClass;
        this.color = color;
        this.heroType = copy.heroType;
        this.avatar = copy.avatar.replace(copy.color, color);
        this.strengthBase = copy.strengthBase;
        this.strengthFull = copy.strengthFull;
        this.hpBase = copy.hpBase;
        this.hpFull = copy.hpFull;
        this.armorBase = copy.armorBase;
        this.armorFull = copy.armorFull;
        this.initiative = copy.initiative;
        this.initiativeAsc = copy.initiativeAsc;
        this.crit = copy.crit;
        this.critAsc = copy.critAsc;
        this.critMult = copy.critMult;
        this.critMultAsc = copy.critMultAsc;
        this.dexterity = copy.dexterity;
        this.dexterityAsc = copy.dexterityAsc;
        this.resistance = copy.resistance;
        this.resistanceAsc = copy.resistanceAsc;
        this.recruitable = copy.recruitable;
        this.maxAscLevel = copy.maxAscLevel;
    }
}