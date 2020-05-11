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

}