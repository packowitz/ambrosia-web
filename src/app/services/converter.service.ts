import {Injectable} from '@angular/core';
import {FightResolved} from '../domain/fightResolved.model';
import {Fight} from '../domain/fight.model';

@Injectable({
    providedIn: 'root'
})
export class ConverterService {

    rarityStars(rarity: string): number {
        if (!rarity) { return 0; }
        switch (rarity) {
            case 'SIMPLE': return 1;
            case 'COMMON': return 2;
            case 'UNCOMMON': return 3;
            case 'RARE': return 4;
            case 'EPIC': return 5;
            case 'LEGENDARY': return 6;
        }
    }

    numberToArray(i: number) {
        return new Array(i);
    }

    rarityToArray(rarity: string) {
        switch (rarity) {
            case 'SIMPLE': return this.numberToArray(1);
            case 'COMMON': return this.numberToArray(2);
            case 'UNCOMMON': return this.numberToArray(3);
            case 'RARE': return this.numberToArray(4);
            case 'EPIC': return this.numberToArray(5);
            case 'LEGENDARY': return this.numberToArray(6);
        }
    }

    colorToSort(color: string): number {
        switch (color) {
            case 'RED': return 1;
            case 'GREEN': return 2;
            case 'BLUE': return 3;
            default: return 99;
        }
    }

    readableIdentifier(name: string): string {
        return name.split('_').map((str) => {
            str = str.toLowerCase();
            return str.slice(0,1).toUpperCase() + str.slice(1,str.length);
        }).join(' ');
    }

    readableAmount(amount: number): string {
        if (amount >= 1000000) {
            return Math.floor(amount / 100000) / 10 + 'm';
        }
        if (amount >= 1000) {
            return Math.floor(amount / 100) / 10 + 'k';
        }
        return amount + '';
    }

    time(secInput: number): string {
        let sec = Math.round(secInput);
        if (sec <= 0) {
            return '0:00';
        }
        if (sec < 10) {
            return '0:0' + sec;
        }
        let secs = sec % 60;
        let mins = (sec - secs) / 60;
        if (mins < 60) {
            return  mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
        let hours = Math.floor(mins / 60);
        mins = mins % 60;
        return hours + ':' + (mins < 10 ? '0' : '') + mins;
    }

    timeWithUnit(secInput: number): string {
        let sec = Math.round(secInput);
        if (sec <= 0) {
            return '0s';
        }
        if (sec <= 60) {
            return sec + 's';
        }
        let value = '';
        let secs = sec % 60;
        let mins = (sec - secs) / 60;
        if (mins < 60) {
            value = mins + 'm';
            if (secs > 0) {
                value += ' ';
                if (secs < 10) {
                    value += '0';
                }
                value += secs + 's';
            }
            return value;
        }
        let hours = Math.floor(mins / 60);
        mins = mins % 60;
        if (hours < 24) {
            value  = hours + 'h';
            if (mins > 0) {
                value += ' ';
                if (mins < 10) {
                    value += '0';
                }
                value += mins + 'm';
            }
            return value;
        }
        let days = Math.floor(hours / 24);
        hours = hours % 24;
        value = days + 'd';
        if (hours > 0) {
            value += ' ';
            if (hours < 10) {
                value += '0';
            }
            value += hours + 'h';
        }
        return value;
    }

    dataClone(orig) {
        return JSON.parse(JSON.stringify(orig));
    }

    asFight(fight: FightResolved): Fight {
        return {
            id: fight.id,
            name: fight.name,
            description: fight.description,
            serviceAccountId: fight.serviceAccount.id,
            resourceType: fight.resourceType,
            costs: fight.costs,
            xp: fight.xp,
            level: fight.level,
            ascPoints: fight.ascPoints,
            travelDuration: fight.travelDuration,
            timePerTurn: fight.timePerTurn,
            maxTurnsPerStage: fight.maxTurnsPerStage,
            stageConfig: fight.stageConfig,
            environment: fight.environment,
            lootBox: fight.lootBox,
            stages: fight.stages.map(s => {
                return {
                    id: s.id,
                    stage: s.stage,
                    hero1Id: s.hero1 ? s.hero1.id : null,
                    hero2Id: s.hero2 ? s.hero2.id : null,
                    hero3Id: s.hero3 ? s.hero3.id : null,
                    hero4Id: s.hero4 ? s.hero4.id : null,
                };
            })
        };
    }

    readableProgressStat(stat: string, value: number): string {
        switch(stat) {
            case 'EXPEDITION_SPEED': return '+' + value + '% Expedition speed';
            case 'NUMBER_ODD_JOBS': return '+' + value + ' Odd Job in progress';
            case 'GARAGE_SLOT': return '+' + value + ' Garage slot';
            case 'MISSION_SPEED': return '+' + value + '% Mission speed';
            case 'MISSION_MAX_BATTLES': return '+' + value + ' Battles per mission';
            case 'BUILDER_QUEUE': return '+' + value + ' Builder queue size';
            case 'BUILDER_SPEED': return '+' + value + '% Building upgrade speed';
            case 'BARRACKS_SIZE': return '+' + value + ' Barracks space';
            case 'GEAR_QUALITY_INCREASE': return '+' + value + '% increased gear quality';
            case 'HERO_TRAIN_LEVEL': return '+' + value + ' Hero train level';
            case 'TRAINING_XP_BOOST': return '+' + value + '% more XP in the academy';
            case 'TRAINING_ASC_BOOST': return '+' + value + '% more Asc points in the academy';
            case 'VEHICLE_UPGRADE_LEVEL': return '+' + value + ' Vehicle upgrade level';
            case 'INCUBATORS': return '+' + value + ' Incubator(s)';
            case 'LAB_SPEED': return '+' + value + '% Incubation speed';
            case 'SIMPLE_GENOMES_NEEDED': return value + ' Simple genomes needed';
            case 'COMMON_GENOMES_NEEDED': return value + ' Common genomes needed';
            case 'UNCOMMON_GENOMES_NEEDED': return value + ' Uncommon genomes needed';
            case 'RARE_GENOMES_NEEDED': return value + ' Rare genomes needed';
            case 'EPIC_GENOMES_NEEDED': return value + ' Epic genomes needed';
            case 'SIMPLE_INCUBATION_UP_PER_MIL': return '+' + this.perMilToPercent(value) + '% Chance to clone a common hero using simple genomes';
            case 'COMMON_INCUBATION_UP_PER_MIL': return '+' + this.perMilToPercent(value) + '% Chance to clone an uncommon hero using common genomes';
            case 'UNCOMMON_INCUBATION_UP_PER_MIL': return '+' + this.perMilToPercent(value) + '% Chance to clone a rare hero using uncommon genomes';
            case 'RARE_INCUBATION_UP_PER_MIL': return '+' + this.perMilToPercent(value) + '% Chance to clone an epic hero using rare genomes';
            case 'UNCOMMON_STARTING_LEVEL': return '+' + value + ' uncommon hero level after incubation';
            case 'JEWEL_UPGRADE_LEVEL': return '+' + value + ' Jewel upgrade level';
            case 'JEWEL_MERGE_DOUBLE_CHANCE': return '+' + value + '% Chance to retrieve 2 jewels after merging';
            case 'GEAR_MOD_RARITY': return '+' + value + ' Gear rarity allowed to modify';
            case 'GEAR_MOD_SPEED': return '+' + value + '% Gear modification speed';
            case 'GEAR_BREAKDOWN_RARITY': return '+' + value + ' Gear rarity allowed to breakdown';
            case 'GEAR_BREAKDOWN_RESOURCES': return '+' + value + '% Resources when breaking down gear';
            case 'REROLL_GEAR_QUALITY': return 'New modification: Re roll quality';
            case 'REROLL_GEAR_STAT': return 'New modification: Re roll stat';
            case 'INC_GEAR_RARITY': return 'New modification: Increase rarity';
            case 'REROLL_GEAR_JEWEL': return 'New modification: Re roll jewel slots';
            case 'ADD_GEAR_JEWEL': return 'New modification: Add jewel slot';
            case 'ADD_GEAR_SPECIAL_JEWEL': return 'New modification: Add set jewel slot';
            case 'NEGOTIATION_LEVEL': return '+' + value + ' Negotiation level';
            case 'ENABLE_TRADING': return 'Access to trading area granted';
            case 'ENABLE_BLACK_MARKET': return 'Access to black market granted';
            case 'ENABLE_CAR_YARD': return 'Access to car yard granted';
            case 'MERCHANT_LEVEL': return '+' + value + ' Merchant level';
            default: return 'Unknown stat: ' + stat;
        }
    }

    readableProgressStatBonus(stat: string, value: number): string {
        let bonus = value >= 0 ? '+' + value : '' + value;
        switch(stat) {
            case 'EXPEDITION_SPEED':
            case 'MISSION_SPEED':
            case 'BUILDER_SPEED':
            case 'GEAR_QUALITY_INCREASE':
            case 'TRAINING_XP_BOOST':
            case 'TRAINING_ASC_BOOST':
            case 'LAB_SPEED':
            case 'JEWEL_MERGE_DOUBLE_CHANCE':
            case 'GEAR_MOD_SPEED':
            case 'GEAR_BREAKDOWN_RESOURCES':
                bonus += '%';
                break;

            case 'PLAYER_XP': return '' + value;

            case 'SIMPLE_INCUBATION_UP_PER_MIL':
            case 'COMMON_INCUBATION_UP_PER_MIL':
            case 'UNCOMMON_INCUBATION_UP_PER_MIL':
            case 'RARE_INCUBATION_UP_PER_MIL':
                return '+' + this.perMilToPercent(value) + '%';
        }
        return bonus;
    }

    perMilToPercent(perMil: number): number {
        return (perMil / 10);
    }

}
