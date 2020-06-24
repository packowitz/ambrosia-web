import {Injectable} from '@angular/core';
import {Player} from '../domain/player.model';
import {Hero} from '../domain/hero.model';
import {Gear} from '../domain/gear.model';
import {HeroBase} from '../domain/herobase.model';
import {Looted, PlayerActionResponse} from './backend.service';
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
import {Progress} from '../domain/progress.model';
import {Vehicle} from '../domain/vehicle.model';
import {VehiclePart} from '../domain/vehiclePart.model';
import {Mission} from '../domain/mission.model';
import {Upgrade} from '../domain/upgrade.model';
import {Incubator} from '../domain/incubator.model';
import {FightResolved} from '../domain/fightResolved.model';
import {ConverterService} from './converter.service';
import {ExpeditionBase} from '../domain/expeditionBase.model';

@Injectable({
    providedIn: 'root'
})
export class Model {

    playerName: string;
    playerId: number;
    activeAccountId: number;
    player: Player;
    progress: Progress;
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
    vehicles: Vehicle[];
    vehicleParts: VehiclePart[];
    lootBoxes: LootBox[];
    gearLoots: GearLoot[];
    maps: Map[];
    playerMaps: PlayerMap[];
    currentMap: PlayerMap;
    baseVehicles: VehicleBase[];
    missions: Mission[];
    upgrades: Upgrade[];
    incubators: Incubator[];
    knownStories: string[];
    looted: Looted;
    expeditionBases: ExpeditionBase[];

    interval: number;
    lastIntervalTimestamp: number = Date.now();
    updateResourcesInProgress = false;
    updateIncubatorsInProgress = false;
    useServiceAccount = false;

    constructor(private http: HttpClient,
                private converter: ConverterService) {}

    reset() {
        this.progress = null;
        this.heroes = null;
        this.gears = null;
        this.teams = null;
        this.ongoingBattle = null;
        this.buildings = null;
        this.vehicles = null;
        this.vehicleParts = null;
        this.playerMaps = null;
        this.currentMap = null;
        this.missions = null;
        this.upgrades = null;
        this.incubators = null;
        this.looted = null;
    }

    getHero(id: number): Hero {
        return this.heroes.find(h => h.id === id);
    }

    getGear(id: number): Gear {
        return this.gears.find(g => g.id === id);
    }

    getVehicle(id: number): Vehicle {
        return this.vehicles.find(v => v.id === id);
    }

    getVehiclePart(id: number): VehiclePart {
        return this.vehicleParts.find(p => p.id === id);
    }

    getBuilding(type: string): Building {
        return this.buildings.find(b => b.type === type);
    }

    hasEnoughResources(type: string, amount: number): boolean {
        return this.getResourceAmount(type) >= amount;
    }

    getResourceAmount(type: string): number {
        if (type === 'STEAM') { return (this.resources.steam + this.resources.premiumSteam); }
        if (type === 'COGWHEELS') { return (this.resources.cogwheels + this.resources.premiumCogwheels); }
        if (type === 'TOKENS') { return (this.resources.tokens + this.resources.premiumTokens); }
        if (type === 'COINS') { return this.resources.coins; }
        if (type === 'RUBIES') { return this.resources.rubies; }
        if (type === 'METAL') { return this.resources.metal; }
        if (type === 'IRON') { return this.resources.iron; }
        if (type === 'STEEL') { return this.resources.steel; }
        if (type === 'WOOD') { return this.resources.wood; }
        if (type === 'BROWN_COAL') { return this.resources.brownCoal; }
        if (type === 'BLACK_COAL') { return this.resources.blackCoal; }
        if (type === 'SIMPLE_GENOME') { return this.resources.simpleGenome; }
        if (type === 'COMMON_GENOME') { return this.resources.commonGenome; }
        if (type === 'UNCOMMON_GENOME') { return this.resources.uncommonGenome; }
        if (type === 'RARE_GENOME') { return this.resources.rareGenome; }
        if (type === 'EPIC_GENOME') { return this.resources.epicGenome; }
        return 0;
    }

    startInterval() {
        this.interval = setInterval(() => {
            let now = Date.now();
            let pauseDetected = (now - this.lastIntervalTimestamp) > 5000;
            if (pauseDetected) {
                console.log("Pause detected. Updating all time based resources");
            }
            this.lastIntervalTimestamp = now;
            if (this.resources) {
                let updateResources = pauseDetected;
                if (this.resources.steam < this.resources.steamMax) {
                    this.resources.steamProduceIn --;
                    updateResources = updateResources || this.resources.steamProduceIn <= 0;
                }
                if (this.resources.cogwheels < this.resources.cogwheelsMax) {
                    this.resources.cogwheelsProduceIn --;
                    updateResources = updateResources || this.resources.cogwheelsProduceIn <= 0;
                }
                if (this.resources.tokens < this.resources.tokensMax) {
                    this.resources.tokensProduceIn --;
                    updateResources = updateResources || this.resources.tokensProduceIn <= 0;
                }
                if (updateResources) {
                    this.updateResources();
                }
            }

            if (this.missions) {
                this.missions.filter(m => !m.missionFinished).forEach(mission => {
                    mission.secondsUntilDone --;
                    mission.nextUpdateSeconds --;
                    mission.battles.forEach(battle => {
                        battle.secondsUntilDone --;
                    });
                    if (pauseDetected || mission.nextUpdateSeconds <= 0 && !mission.updating) {
                        mission.updating = true;
                        this.http.post<PlayerActionResponse>(API_URL + '/battle/mission/' + mission.id, null).subscribe(data => {
                            console.log("Updated mission " + data.missions[0].id);
                        });
                    }
                });
            }

            if (this.upgrades) {
                let upgradeInProgress = this.upgrades.find(u => u.inProgress);
                if (upgradeInProgress) {
                    upgradeInProgress.secondsUntilDone --;
                    if (pauseDetected || upgradeInProgress.secondsUntilDone <= 0 && !upgradeInProgress.updating) {
                        upgradeInProgress.updating = true;
                        this.http.post<PlayerActionResponse>(API_URL + '/upgrade/check', null).subscribe(() => {
                            console.log("Updated upgrades");
                        });
                    }
                }
            }

            if (this.incubators) {
                let incubatorUpdate = pauseDetected;
                this.incubators.filter(i => !i.finished).forEach(incubator => {
                    incubator.secondsUntilDone --;
                    if (incubator.secondsUntilDone <= 0) {
                        incubatorUpdate = true;
                    }
                });
                if (incubatorUpdate) {
                    this.updateIncubators();
                }
            }
        }, 1000);
    }

    updateResources() {
        if (!this.updateResourcesInProgress) {
            this.updateResourcesInProgress = true;
            this.http.get<Resources>(API_URL + '/resources').subscribe(data => {
                this.resources = data;
                this.updateResourcesInProgress = false;
                console.log('resources updated');
            }, () => {
                this.updateResourcesInProgress = false;
                console.log('resource update failed');
            });
        }
    }

    updateIncubators() {
        if (!this.updateIncubatorsInProgress) {
            this.updateIncubatorsInProgress = true;
            this.http.get<Incubator[]>(API_URL + '/laboratory/incubators').subscribe(data => {
                this.incubators = data;
                this.updateIncubatorsInProgress = false;
                console.log('incubators updated');
            }, () => {
                this.updateIncubatorsInProgress = false;
                console.log('incubators update failed');
            });
        }
    }

    update(data: PlayerActionResponse) {
        if (data.player) {
            this.player = data.player;
        }
        if (data.token) {
            let key = environment.tokenKey;
            if (this.player.serviceAccount) {
                key = environment.serviceTokenKey;
            }
            localStorage.setItem(key, data.token);
        }
        if (data.progress) {
            this.progress = data.progress;
        }
        if (data.upgrades) {
            if (this.upgrades) {
                data.upgrades.forEach(u => this.updateUpgrade(u));
            } else {
                this.upgrades = data.upgrades;
            }
        }
        if (data.upgradeRemoved) {
            let idx = this.upgrades.findIndex(u => u.id === data.upgradeRemoved);
            if (idx >= 0) {
                this.upgrades.splice(idx, 1);
            }
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
        if (data.vehicles) {
            if (this.vehicles) {
                data.vehicles.forEach(v => this.updateVehicle(v));
            } else {
                this.vehicles = data.vehicles;
            }
        }
        if (data.vehicleParts) {
            if (this.vehicleParts) {
                data.vehicleParts.forEach(p => this.updateVehiclePart(p));
            } else {
                this.vehicleParts = data.vehicleParts;
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
        if (data.missions) {
            if (this.missions) {
                data.missions.forEach(m => this.updateMission(m));
            } else {
                this.missions = data.missions;
            }
        }
        if (data.missionIdFinished && this.missions) {
            let idx = this.missions.findIndex(m => m.id === data.missionIdFinished);
            if (idx >= 0) {
                this.missions.splice(idx, 1);
            }
        }
        if (data.incubators) {
            if (this.incubators) {
                data.incubators.forEach(i => this.updateIncubator(i));
            } else {
                this.incubators = data.incubators;
            }
        }
        if (data.incubatorDone && this.incubators) {
            let idx = this.incubators.findIndex(i => i.id === data.incubatorDone);
            if (idx >= 0) {
                this.incubators.splice(idx, 1);
            }
        }
        if (data.knownStories) {
            if (this.knownStories) {
                data.knownStories.forEach(s => this.finishedStory(s));
            } else {
                this.knownStories = data.knownStories;
            }
        }
        if (data.looted) {
            this.looted = data.looted;
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
            this.heroes = this.heroes.sort((a, b) => {
                if (a.level === b.level) {
                    if (a.stars === b.stars) {
                        if (a.heroBase.id === b.heroBase.id) {
                            return a.id - b.id;
                        } else {
                            return a.heroBase.id - b.heroBase.id;
                        }
                    } else {
                        return b.stars - a.stars;
                    }
                } else {
                    return b.level - a.level;
                }
            });
        }
    }

    updateGear(gear?: Gear) {
        if (gear && !gear.equippedTo) {
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
            if (map.mapId === this.progress.currentMapId) {
                this.currentMap = map;
            }
        }
    }

    updateFight(fight?: FightResolved) {
        if (fight && this.fights) {
            let idx = this.fights.findIndex(f => f.id === fight.id);
            if (idx >= 0) {
                this.fights[idx] = this.converter.asFight(fight);
            } else {
                this.fights.push(this.converter.asFight(fight));
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

    updateVehicle(vehicle?: Vehicle) {
        if (vehicle) {
            let idx = this.vehicles.findIndex(v => v.id === vehicle.id);
            if (idx >= 0) {
                this.vehicles[idx] = vehicle;
            } else {
                this.vehicles.push(vehicle);
            }
        }
    }

    updateVehiclePart(part?: VehiclePart) {
        if (part) {
            let idx = this.vehicleParts.findIndex(p => p.id === part.id);
            if (idx >= 0) {
                this.vehicleParts[idx] = part;
            } else {
                this.vehicleParts.push(part);
            }
        }
    }

    updateMission(mission?: Mission) {
        if (mission && mission.id && mission.id > 0) {
            let idx = this.missions.findIndex(m => m.id === mission.id);
            if (idx >= 0) {
                this.missions[idx] = mission;
            } else {
                this.missions.push(mission);
                this.missions = this.missions.sort((a, b) => a.slotNumber - b.slotNumber);
            }
        }
    }

    updateUpgrade(upgrade?: Upgrade) {
        if (upgrade) {
            let idx = this.upgrades.findIndex(u => u.id === upgrade.id);
            if (idx >= 0) {
                this.upgrades[idx] = upgrade;
            } else {
                this.upgrades.push(upgrade);
                this.upgrades = this.upgrades.sort((a, b) => a.position - b.position);
            }
        }
    }

    updateIncubator(incubator?: Incubator) {
        if (incubator) {
            let idx = this.incubators.findIndex(i => i.id === incubator.id);
            if (idx >= 0) {
                this.incubators[idx] = incubator;
            } else {
                this.incubators.push(incubator);
            }
        }
    }

    finishedStory(story: string) {
        if (story) {
            if (this.knownStories.indexOf(story) === -1) {
                this.knownStories.push(story);
            }
        }
    }

}
