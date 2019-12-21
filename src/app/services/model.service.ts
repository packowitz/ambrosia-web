import {Injectable} from '@angular/core';
import {Player} from '../domain/player.model';
import {Hero} from '../domain/hero.model';
import {Gear} from '../domain/gear.model';
import {HeroBase} from '../domain/herobase.model';
import {PlayerActionResponse} from './backend.service';
import {Team} from '../domain/team.model';
import {Battle} from '../domain/battle.model';
import {environment} from '../../environments/environment';
import {Dungeon} from '../domain/dungeon.model';

@Injectable({
    providedIn: 'root'
})
export class Model {

    playerName: string;
    playerId: number;
    activeAccountId: number;
    player: Player;
    baseHeroes: HeroBase[];
    heroes: Hero[];
    gears: Gear[];
    teams: Team[];
    ongoingBattle?: Battle;
    serviceAccounts: Player[] = [];
    dungeons: Dungeon[];

    reset() {
        this.heroes = null;
        this.gears = null;
        this.teams = null;
        this.ongoingBattle = null;
    }

    update(data: PlayerActionResponse) {
        if (data.player) {
            this.player = data.player;
        }
        if (data.token) {
            let key = environment.production ? 'ambrosia-jwt' : 'jwt';
            if (this.player.serviceAccount) {
                key += '-service';
            }
            localStorage.setItem(key, data.token);
        }
        if (data.hero) {
            this.updateHero(data.hero);
        }
        if (data.heroes) {
            if (this.heroes) {
                data.heroes.forEach(h => this.updateHero(h));
            } else {
                this.heroes = data.heroes;
            }
        }
        if (data.heroIdsRemoved && this.heroes) {
            this.heroes = this.heroes.filter(h => data.heroIdsRemoved.findIndex(i => i === h.id) === -1);
        }
        if (data.gear) {
            this.updateGear(data.gear);
        }
        if (data.gears) {
            if (this.gears) {
                data.gears.forEach(g => this.updateGear(g));
            } else {
                this.gears = data.gears;
            }
        }
        if (data.gearIdsRemovedFromArmory && this.gears) {
            this.gears = this.gears.filter(g => data.gearIdsRemovedFromArmory.findIndex(i => i === g.id) === -1);
        }
        if (data.ongoingBattle) {
            this.ongoingBattle = data.ongoingBattle;
        }
    }

    updateHero(hero?: Hero) {
        if (hero) {
            let idx = this.heroes.findIndex(h => h.id === hero.id);
            if (idx >= 0) {
                this.heroes[idx] = hero;
            } else {
                this.heroes.push(hero);
            }
        }
    }

    updateGear(gear?: Gear) {
        if (gear) {
            let idx = this.gears.findIndex(g => g.id === gear.id);
            if (idx >= 0) {
                this.gears[idx] = gear;
            } else {
                this.gears.push(gear);
            }
        }
    }

}
