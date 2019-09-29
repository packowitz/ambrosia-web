import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HeroBase} from '../domain/herobase.model';
import {Hero} from '../domain/hero.model';
import {Player} from '../domain/player.model';
import {Gear} from '../domain/gear.model';
import {Jewelry} from '../domain/jewelry.model';
import {map} from 'rxjs/operators';
import {Team} from '../domain/team.model';
import {OtherTeam} from '../domain/otherTeam.model';
import {Battle} from '../domain/battle.model';
import {BattleHero} from '../domain/battleHero.model';
import {HeroSkill} from '../domain/heroSkill.model';
import {API_URL} from '../../environments/environment';


export class PlayerActionResponse {
    player?: Player;
    token?: string;
    hero?: Hero;
    heroes?: Hero[];
    heroIdsRemoved?: number[];
    gear?: Gear;
    gears?: Gear[];
    gearIdsRemovedFromArmory?: number[];
    jewelries?: Jewelry[];
    ongoingBattle?: Battle;
}

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    constructor(private http: HttpClient) {}

    getPlayer(): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/player', null);
    }

    login(email: string, password: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/auth/login', {email: email, password: password});
    }

    register(name: string, email: string, password: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/auth/register', {name: name, email: email, password: password});
    }

    getHeroBases(): Observable<HeroBase[]> {
        return this.http.get<HeroBase[]>(API_URL + '/admin/hero_base');
    }

    getHeroBase(id): Observable<HeroBase> {
        return this.http.get<HeroBase>(API_URL + '/admin/hero_base/' + id);
    }

    createHeroBase(data): Observable<HeroBase> {
        return this.http.post<HeroBase>(API_URL + '/admin/hero_base', data);
    }

    saveHeroBase(hero: HeroBase): Observable<HeroBase> {
        return this.http.put<HeroBase>(API_URL + '/admin/hero_base/' + hero.id, hero);
    }

    recruitHero(hero: HeroBase): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/recruit/' + hero.id, null)
            .pipe(map(action => action.hero));
    }

    recruitRandomHero(type: String): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/hero/recruit/' + type, null)
            .pipe(map(action => action.hero));
    }

    getAllOwnHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(API_URL + '/hero');
    }

    getRandomGear(): Observable<Gear> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/gear/open/something', null)
            .pipe(map(action => action.gear));
    }

    getAllOwnGear(): Observable<Gear[]> {
        return this.http.get<Gear[]>(API_URL + '/gear');
    }

    getRandomJewel(): Observable<Jewelry> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/jewelry/open/something', null)
            .pipe(map(action => action.jewelries[0]));
    }

    getOwnJewelries(): Observable<Jewelry[]> {
        return this.http.get<Jewelry[]>(API_URL + '/jewelry');
    }

    equipGear(hero: Hero, gear: Gear): Observable<Hero> {
        let request = {
            heroId: hero.id,
            gearId: gear.id
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/equip', request)
            .pipe(map(action => action.hero));
    }

    unequipGear(hero: Hero, gear: Gear): Observable<Hero> {
        let request = {
            heroId: hero.id,
            gearId: gear.id
        };
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/unequip', request)
            .pipe(map(action => action.hero));
    }

    adminHeroGainLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/gain_level', null)
            .pipe(map(action => action.hero));
    }

    adminHeroLooseLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/loose_level', null)
            .pipe(map(action => action.hero));
    }

    adminHeroGainSkillLevel(hero: Hero, skillNumber: number): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/skill_up/' + skillNumber, null)
            .pipe(map(action => action.hero));
    }

    adminHeroLooseSkillLevel(hero: Hero, skillNumber: number): Observable<Hero> {
        return this.http.post<PlayerActionResponse>(API_URL + '/admin/hero/' + hero.id + '/skill_down/' + skillNumber, null)
            .pipe(map(action => action.hero));
    }

    upgradeJewel(type: string, level: number): Observable<Jewelry> {
        return this.http.post<PlayerActionResponse>(API_URL + '/jewelry/merge/' + type + '/' + level, {})
            .pipe(map(action => action.jewelries[0]));
    }

    pluginJewel(gear: Gear, slot: number, type: string, level: number): Observable<PlayerActionResponse> {
        let request = {gearId: gear.id, slot: slot, jewelType: type, lvl: level};
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/plugin/jewel', request);
    }

    unplugJewel(gear: Gear, slot: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>(API_URL + '/gear/unplug/jewel', {gearId: gear.id, slot: slot});
    }

    getOwnTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(API_URL + '/teams');
    }

    saveTeam(team: Team): Observable<Team> {
        if (team.id) {
            return this.http.put<Team>(API_URL + '/teams/' + team.id, team);
        } else {
            return this.http.post<Team>(API_URL + '/teams/type/' + team.type, team);
        }
    }

    getOtherTeams(type: string): Observable<OtherTeam[]> {
        return this.http.get<OtherTeam[]>(API_URL + '/teams/type/' + type);
    }

    startDuell(otherTeam: OtherTeam, ownTeam: Team): Observable<Battle> {
        let request = {
            type: 'DUELL',
            oppPlayerId: otherTeam.playerId,
            hero1Id: ownTeam.hero1Id,
            hero2Id: ownTeam.hero2Id,
            hero3Id: ownTeam.hero3Id,
            hero4Id: ownTeam.hero4Id,
            oppHero1Id: otherTeam.hero1 ? otherTeam.hero1.id : null,
            oppHero2Id: otherTeam.hero2 ? otherTeam.hero2.id : null,
            oppHero3Id: otherTeam.hero3 ? otherTeam.hero3.id : null,
            oppHero4Id: otherTeam.hero4 ? otherTeam.hero4.id : null
        };
        return this.http.post<Battle>(API_URL + '/battle', request);
    }

    takeTurn(battle: Battle, hero: BattleHero, skill: HeroSkill, target: BattleHero): Observable<Battle> {
        let url = API_URL + '/battle/' + battle.id + '/' + hero.position + '/' + skill.number + '/' + target.position;
        return this.http.post<Battle>(url, null);
    }

}