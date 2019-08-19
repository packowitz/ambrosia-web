import {HeroSkill} from './heroSkill.model';

export class HeroBase {
    id: number;
    name: string;
    rarity: string;
    heroClass: string;
    color: string;
    heroType: string;
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
    skills: HeroSkill[];
}