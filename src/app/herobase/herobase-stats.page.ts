import {Component} from '@angular/core';
import {EnumService} from '../services/enum.service';
import {BackendService} from '../services/backend.service';
import {ToastController} from '@ionic/angular';
import {HeroBase} from '../domain/herobase.model';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {HeroSkill} from '../domain/heroSkill.model';

export class SkillStat {
    number: number;
    name: string;
    description: string;
    maxLvl: number;
    target = "";
    initCooldown: number;
    cooldown: number;
    baseDamage = 0;
    fullDamage = 0;

    damages: SkillStatDmgDef[] = [];
}

export class SkillStatDmgDef {
    type: string;
    scale: string;

    constructor(type: string, scale: string) {
        this.type = type;
        this.scale = scale;
    }
}

@Component({
    selector: 'herobase-stats',
    templateUrl: 'herobase-stats.page.html'
})
export class HerobaseStatsPage {

    saving = false;

    heroes: HeroBase[] = [];

    sorting = 'RarityDesc';
    onlyCloneable = false;
    showFullySkilled = false;
    showSimpleHeroes = true;
    showCommonHeroes = true;
    showUncommonHeroes = true;
    showRareHeroes = true;
    showEpicHeroes = true;

    constructor(public enumService: EnumService,
                private backendService: BackendService,
                private toastCtrl: ToastController,
                private converter: ConverterService,
                private model: Model,
                private router: Router) {
    }

    ionViewWillEnter(): void {

        if (!this.model.baseHeroes) {
            this.backendService.getHeroBases().subscribe(data => {
                this.model.baseHeroes = data;
                this.setHeroList();
            });
        } else {
            this.setHeroList();
        }
    }

    showBaseHeroes() {
        this.router.navigateByUrl('/herobase/list');
    }

    setHeroList() {
        let heroList = this.model.baseHeroes.filter(h => {
            if (this.onlyCloneable && !h.recruitable) { return false; }
            if (!this.showSimpleHeroes && h.rarity === 'SIMPLE') { return false; }
            if (!this.showCommonHeroes && h.rarity === 'COMMON') { return false; }
            if (!this.showUncommonHeroes && h.rarity === 'UNCOMMON') { return false; }
            if (!this.showRareHeroes && h.rarity === 'RARE') { return false; }
            if (!this.showEpicHeroes && h.rarity === 'EPIC') { return false; }
            return true;
        });
        this.sort(heroList);
    }

    sort(heroList: HeroBase[]) {
        if (this.sorting === 'RarityAsc') {
            this.heroes = heroList.sort((a: HeroBase, b: HeroBase) => this.converter.rarityStars(a.rarity) === this.converter.rarityStars(b.rarity) ? (a.heroClass === b.heroClass ? this.colorOrder(a.color) - this.colorOrder(b.color) : a.heroClass < b.heroClass ? -1 : 1) : this.converter.rarityStars(a.rarity) - this.converter.rarityStars(b.rarity));
        }
        if (this.sorting === 'RarityDesc') {
            this.heroes = heroList.sort((a: HeroBase, b: HeroBase) => this.converter.rarityStars(a.rarity) === this.converter.rarityStars(b.rarity) ? (a.heroClass === b.heroClass ? this.colorOrder(a.color) - this.colorOrder(b.color) : a.heroClass < b.heroClass ? -1 : 1) : this.converter.rarityStars(b.rarity) - this.converter.rarityStars(a.rarity));
        }
        if (this.sorting === 'NameAsc') {
            this.heroes = heroList.sort((a: HeroBase, b: HeroBase) => a.heroClass === b.heroClass ? (a.rarity === b.rarity ? this.colorOrder(a.color) - this.colorOrder(b.color) : this.converter.rarityStars(b.rarity) - this.converter.rarityStars(a.rarity)) : a.heroClass < b.heroClass ? -1 : 1);
        }
        if (this.sorting === 'NameDesc') {
            this.heroes = heroList.sort((a: HeroBase, b: HeroBase) => a.heroClass === b.heroClass ? (a.rarity === b.rarity ? this.colorOrder(a.color) - this.colorOrder(b.color) : this.converter.rarityStars(b.rarity) - this.converter.rarityStars(a.rarity)) : a.heroClass < b.heroClass ? 1 : -1);
        }
    }

    colorOrder(color: string): number {
        if (color === 'RED') { return 1; }
        if (color === 'GREEN') { return 2; }
        if (color === 'BLUE') { return 3; }
        if (color === 'NEUTRAL') { return 4; }
        return -1;
    }

    gotoHero(hero: HeroBase) {
        this.router.navigateByUrl('/herobase/edit/' + hero.id);
    }

    heroSkills(hero): SkillStat[] {
        return hero.skills.filter((s: HeroSkill) => !s.passive && s.actions.find(a => a.type === 'DEAL_DAMAGE')).map(s => {
            let stat = new SkillStat();
            stat.name = s.name;
            stat.description = s.description;
            stat.number = s.number;
            stat.maxLvl = s.maxLevel;
            stat.initCooldown = s.initCooldown;
            stat.cooldown = s.cooldown;

            s.actions
                .filter(a => a.trigger === 'ALWAYS' || (a.trigger === 'SKILL_LVL' && this.actionTriggered(a.triggerValue, this.showFullySkilled ? s.maxLevel : 1)))
                .forEach(a => {
                if (a.type === 'ADD_BASE_DMG') {
                    switch (a.effect) {
                        case 'STRENGTH_SCALING':
                            stat.baseDamage += hero.strengthBase * a.effectValue / 100;
                            stat.fullDamage += hero.strengthFull * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("STR", a.effectValue + '%'));
                            break;
                        case 'ARMOR_SCALING':
                            stat.baseDamage += hero.armorBase * a.effectValue / 100;
                            stat.fullDamage += hero.armorFull * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("ARM", a.effectValue + '%'));
                            break;
                        case 'ARMOR_MAX_SCALING':
                            stat.baseDamage += hero.armorBase * a.effectValue / 100;
                            stat.fullDamage += hero.armorFull * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("ARM_MAX", a.effectValue + '%'));
                            break;
                        case 'HP_SCALING':
                            stat.baseDamage += hero.hpBase * a.effectValue / 100;
                            stat.fullDamage += hero.hpFull * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("HP", a.effectValue + '%'));
                            break;
                        case 'HP_MAX_SCALING':
                            stat.baseDamage += hero.hpBase * a.effectValue / 100;
                            stat.fullDamage += hero.hpFull * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("HP_MAX", a.effectValue + '%'));
                            break;
                        case 'DEXTERITY_SCALING':
                            stat.baseDamage += hero.dexterity * a.effectValue / 100;
                            stat.fullDamage += hero.dexterityAsc * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("DEX", a.effectValue + '%'));
                            break;
                        case 'RESISTANCE_SCALING':
                            stat.baseDamage += hero.resistance * a.effectValue / 100;
                            stat.fullDamage += hero.resistanceAsc * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("RES", a.effectValue + '%'));
                            break;
                        case 'HERO_LVL_SCALING':
                            stat.baseDamage += a.effectValue / 100;
                            stat.fullDamage += 60 * a.effectValue / 100;
                            stat.damages.push(new SkillStatDmgDef("HERO_LVL", a.effectValue + '%'));
                            break;
                        case 'DMG_MULTIPLIER':
                            stat.baseDamage *= (100 + a.effectValue) / 100;
                            stat.fullDamage *= (100 + a.effectValue) / 100;
                            stat.damages.push(new SkillStatDmgDef("MULT", a.effectValue + '%'));
                            break;
                        case 'FIXED_DMG':
                            stat.baseDamage += a.effectValue;
                            stat.fullDamage += a.effectValue;
                            stat.damages.push(new SkillStatDmgDef("FIX", a.effectValue + ''));
                            break;
                    }
                    stat.baseDamage = Math.floor(stat.baseDamage);
                    stat.fullDamage = Math.floor(stat.fullDamage);
                }

                if (a.type === 'DEAL_DAMAGE') {
                    if (stat.target) {
                        stat.target += '; ';
                    }
                    stat.target += a.effectValue + '% on ' + a.target;
                    // switch (a.target) {
                    //     case 'TARGET':
                    //         stat.target += 'T';
                    //         break;
                    //     case 'ALL_OPP':
                    //         stat.target += 'AOE';
                    //         break;
                    //     case 'ALL_OTHER_OPP':
                    //         stat.target += 'O_AOE';
                    //         break;
                    //     case 'RANDOM_OPP':
                    //         stat.target += 'RDM';
                    //         break;
                    //     case 'RANDOM_OTHER_OPP':
                    //         stat.target += 'RDM_O';
                    //         break;
                    //     case 'SELF':
                    //         stat.target += 'SELF';
                    //         break;
                    //     default: stat.target += a.target;
                    // }
                }
            });

            return stat;
        });
    }

    actionTriggered(triggerValue: string, level: number): boolean {
        if (triggerValue.startsWith(">")) {
            return level > Number(triggerValue.substring(1).trim());
        } else if (triggerValue.startsWith(">=")) {
            return level >= Number(triggerValue.substring(2).trim());
        } else if (triggerValue.startsWith("<")) {
            return level < Number(triggerValue.substring(1).trim());
        } else if (triggerValue.startsWith("<=")) {
            return level <= Number(triggerValue.substring(2).trim());
        } else {
            return triggerValue.indexOf('' + level) !== -1;
        }
    }
}
