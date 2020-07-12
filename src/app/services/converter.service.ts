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

    readableIdentifier(name: string): string {
        return name.split('_').map((str) => {
            str = str.toLowerCase();
            return str.slice(0,1).toUpperCase() + str.slice(1,str.length);
        }).join(' ');
    }

    time(sec: number): string {
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

    timeWithUnit(sec: number): string {
        if (sec <= 0) {
            return '0:00 s';
        }
        if (sec < 10) {
            return '0:0' + sec + ' m';
        }
        let secs = sec % 60;
        let mins = (sec - secs) / 60;
        if (mins < 60) {
            return  mins + ':' + (secs < 10 ? '0' : '') + secs + ' m';
        }
        let hours = Math.floor(mins / 60);
        mins = mins % 60;
        return hours + ':' + (mins < 10 ? '0' : '') + mins + ' h';
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
            default: return '';
        }
    }

    perMilToPercent(perMil: number): number {
        return (perMil / 10);
    }

}