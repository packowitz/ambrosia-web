import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HeroBase} from '../domain/herobase.model';
import {Hero} from '../domain/hero.model';
import {Player} from '../domain/player.model';
import {Gear} from '../domain/gear.model';
import {Jewelry} from '../domain/jewelry.model';
import {map} from 'rxjs/operators';
import {DynamicProperty} from '../domain/property.model';


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
}

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    constructor(private http: HttpClient) {}

    getPlayer(): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/player', null);
    }

    login(email: string, password: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/auth/login', {email: email, password: password});
    }

    register(name: string, email: string, password: string): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/auth/register', {name: name, email: email, password: password});
    }

    getHeroBases(): Observable<HeroBase[]> {
        return this.http.get<HeroBase[]>('http://localhost:8080/admin/hero_base');
    }

    getHeroBase(id): Observable<HeroBase> {
        return this.http.get<HeroBase>('http://localhost:8080/admin/hero_base/' + id);
    }

    createHeroBase(data): Observable<HeroBase> {
        return this.http.post<HeroBase>('http://localhost:8080/admin/hero_base', data);
    }

    saveHeroBase(hero: HeroBase): Observable<HeroBase> {
        return this.http.put<HeroBase>('http://localhost:8080/admin/hero_base/' + hero.id, hero);
    }

    recruitHero(hero: HeroBase): Observable<Hero> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/admin/hero/recruit/' + hero.id, null)
            .pipe(map(action => action.hero));
    }

    recruitRandomHero(type: String): Observable<Hero> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/hero/recruit/' + type, null)
            .pipe(map(action => action.hero));
    }

    getAllOwnHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>('http://localhost:8080/hero');
    }

    getRandomGear(): Observable<Gear> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/admin/gear/open/something', null)
            .pipe(map(action => action.gear));
    }

    getAllOwnGear(): Observable<Gear[]> {
        return this.http.get<Gear[]>('http://localhost:8080/gear');
    }

    getRandomJewel(): Observable<Jewelry> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/admin/jewelry/open/something', null)
            .pipe(map(action => action.jewelries[0]));
    }

    getOwnJewelries(): Observable<Jewelry[]> {
        return this.http.get<Jewelry[]>('http://localhost:8080/jewelry');
    }

    equipGear(hero: Hero, gear: Gear): Observable<Hero> {
        let request = {
            heroId: hero.id,
            gearId: gear.id
        };
        return this.http.post<PlayerActionResponse>('http://localhost:8080/gear/equip', request)
            .pipe(map(action => action.hero));
    }

    unequipGear(hero: Hero, gear: Gear): Observable<Hero> {
        let request = {
            heroId: hero.id,
            gearId: gear.id
        };
        return this.http.post<PlayerActionResponse>('http://localhost:8080/gear/unequip', request)
            .pipe(map(action => action.hero));
    }

    adminHeroGainLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/admin/hero/' + hero.id + '/gain_level', null)
            .pipe(map(action => action.hero));
    }

    adminHeroLooseLevel(hero: Hero): Observable<Hero> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/admin/hero/' + hero.id + '/loose_level', null)
            .pipe(map(action => action.hero));
    }

    upgradeJewel(type: string, level: number): Observable<Jewelry> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/jewelry/merge/' + type + '/' + level, {})
            .pipe(map(action => action.jewelries[0]));
    }

    pluginJewel(gear: Gear, slot: number, type: string, level: number): Observable<PlayerActionResponse> {
        let request = {gearId: gear.id, slot: slot, jewelType: type, lvl: level};
        return this.http.post<PlayerActionResponse>('http://localhost:8080/gear/plugin/jewel', request);
    }

    unplugJewel(gear: Gear, slot: number): Observable<PlayerActionResponse> {
        return this.http.post<PlayerActionResponse>('http://localhost:8080/gear/unplug/jewel', {gearId: gear.id, slot: slot});
    }

}