import {Injectable} from '@angular/core';
import {Player} from '../domain/player.model';
import {Hero} from '../domain/hero.model';
import {Gear} from '../domain/gear.model';
import {HeroBase} from '../domain/herobase.model';
import {PlayerActionResponse} from './backend.service';
import {Team} from '../domain/team.model';
import {Battle} from '../domain/battle.model';
import {API_URL, environment} from '../../environments/environment';
import {Fight} from '../domain/fight.model';
import {Map} from '../domain/map.model';
import {PlayerMap} from '../domain/playerMap.model';
import {FightStageConfig} from '../domain/fightStageConfig.model';
import {FightEnvironment} from '../domain/fightEnvironment.model';
import {Building} from '../domain/building.model';
import {Resources} from '../domain/resources.model';
import {HttpClient} from '@angular/common/http';
import {LootBox} from '../domain/lootBox.model';
import {GearLoot} from '../domain/gearLoot.model';
import {VehicleBase} from '../domain/vehicleBase.model';

@Injectable({
    providedIn: 'root'
})
export class Model {

    playerName: string;
    playerId: number;
    activeAccountId: number;
    player: Player;
    resources: Resources;
    baseHeroes: HeroBase[];
    heroes: Hero[];
    gears: Gear[];
    teams: Team[];
    ongoingBattle?: Battle;
    serviceAccounts: Player[] = [];
    fights: Fight[];
    fightStageConfigs: FightStageConfig[];
    fightEnvironments: FightEnvironment[];
    buildings: Building[];
    lootBoxes: LootBox[];
    gearLoots: GearLoot[];
    maps: Map[];
    playerMaps: PlayerMap[];
    currentMap: PlayerMap;
    baseVehicles: VehicleBase[];

    interval: number;
    updateInProgress = false;

    constructor(private http: HttpClient) {}

    reset() {
        this.heroes = null;
        this.gears = null;
        this.teams = null;
        this.ongoingBattle = null;
        this.playerMaps = null;
        this.currentMap = null;
    }

    getHero(id: number): Hero {
        return this.heroes.find(h => h.id === id);
    }

    getGear(id: number): Gear {
        return this.gears.find(g => g.id === id);
    }

    startInterval() {
        this.interval = setInterval(() => {
            let needUpdate = false;
            if (this.resources.steam < this.resources.steamMax) {
                this.resources.steamProduceIn --;
                needUpdate = needUpdate || this.resources.steamProduceIn <= 0;
            }
            if (this.resources.cogwheels < this.resources.cogwheelsMax) {
                this.resources.cogwheelsProduceIn --;
                needUpdate = needUpdate || this.resources.cogwheelsProduceIn <= 0;
            }
            if (this.resources.tokens < this.resources.tokensMax) {
                this.resources.tokensProduceIn --;
                needUpdate = needUpdate || this.resources.tokensProduceIn <= 0;
            }

            if (needUpdate) {
                this.updateResources();
            }
        }, 1000);
    }

    updateResources() {
        if (!this.updateInProgress) {
            this.updateInProgress = true;
            this.http.get<Resources>(API_URL + '/resources').subscribe(data => {
                this.resources = data;
                this.updateInProgress = false;
                console.log('resources updated');
            }, () => {
                this.updateInProgress = false;
                console.log('resource update failed');
            });
        }
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
        if (data.resources) {
            this.resources = data.resources;
            if (!this.interval) {
                this.startInterval();
            }
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
        if (data.buildings) {
            if (this.buildings) {
                data.buildings.forEach(b => this.updateBuilding(b));
            } else {
                this.buildings = data.buildings;
            }
        }
        if (data.playerMaps) {
            if (this.playerMaps) {
                data.playerMaps.forEach(m => this.updatePlayerMap(m));
            } else {
                this.playerMaps = data.playerMaps;
            }
        }
        if (data.currentMap) {
            this.updatePlayerMap(data.currentMap);
        }
        if (data.ongoingBattle) {
            if (data.ongoingBattle.status === 'WON' || data.ongoingBattle.status === 'LOST') {
                this.ongoingBattle = null;
            } else {
                this.ongoingBattle = data.ongoingBattle;
            }
        }
    }

    updateBaseHero(hero?: HeroBase) {
        if (hero) {
            let idx = this.baseHeroes.findIndex(h => h.id === hero.id);
            if (idx >= 0) {
                this.baseHeroes[idx] = hero;
            } else {
                this.baseHeroes.push(hero);
            }
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

    updateBuilding(building?: Building) {
        if (building) {
            let idx = this.buildings.findIndex(g => g.id === building.id);
            if (idx >= 0) {
                this.buildings[idx] = building;
            } else {
                this.buildings.push(building);
            }
        }
    }

    updateMap(map?: Map) {
        if (map) {
            let idx = this.maps.findIndex(g => g.id === map.id);
            if (idx >= 0) {
                this.maps[idx] = map;
            } else {
                this.maps.push(map);
            }
        }
    }

    updatePlayerMap(map?: PlayerMap) {
        if (map) {
            let idx = this.playerMaps.findIndex(g => g.mapId === map.mapId);
            if (idx >= 0) {
                this.playerMaps[idx] = map;
            } else {
                this.playerMaps.push(map);
            }
            if (map.mapId === this.player.currentMapId) {
                this.currentMap = map;
            }
        }
    }

    updateFightStageConfig(config?: FightStageConfig) {
        if (config) {
            let idx = this.fightStageConfigs.findIndex(c => c.id === config.id);
            if (idx >= 0) {
                this.fightStageConfigs[idx] = config;
            } else {
                this.fightStageConfigs.push(config);
            }
        }
    }

    updateFightEnvironment(env?: FightEnvironment) {
        if (env) {
            let idx = this.fightEnvironments.findIndex(e => e.id === env.id);
            if (idx >= 0) {
                this.fightEnvironments[idx] = env;
            } else {
                this.fightEnvironments.push(env);
            }
        }
    }

    updateLootBox(lootBox?: LootBox) {
        if (lootBox) {
            let idx = this.lootBoxes.findIndex(l => l.id === lootBox.id);
            if (idx >= 0) {
                this.lootBoxes[idx] = lootBox;
            } else {
                this.lootBoxes.push(lootBox);
            }
        }
    }

    updateGearLoot(gearLoot?: GearLoot) {
        if (gearLoot) {
            let idx = this.gearLoots.findIndex(l => l.id === gearLoot.id);
            if (idx >= 0) {
                this.gearLoots[idx] = gearLoot;
            } else {
                this.gearLoots.push(gearLoot);
            }
        }
    }

    updateTeam(team?: Team) {
        if (team) {
            let idx = this.teams.findIndex(t => t.type === team.type);
            if (idx >= 0) {
                this.teams[idx] = team;
            } else {
                this.teams.push(team);
            }
        }
    }

    updateVehicleBase(vehicle?: VehicleBase) {
        if (vehicle) {
            let idx = this.baseVehicles.findIndex(t => t.id === vehicle.id);
            if (idx >= 0) {
                this.baseVehicles[idx] = vehicle;
            } else {
                this.baseVehicles.push(vehicle);
            }
        }
    }

}
