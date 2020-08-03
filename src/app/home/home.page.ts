import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {PlayerMapTile} from '../domain/playerMapTile.model';
import {BackendService} from '../services/backend.service';
import {AlertController, ModalController, PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Building} from '../domain/building.model';
import {ConverterService} from '../services/converter.service';
import {PropertyService} from '../services/property.service';
import {Mission} from '../domain/mission.model';
import {MissionProgressModal} from './mission-progress-modal';
import {StoryService} from '../services/story.service';
import {BuildingService} from '../services/building.service';
import {JewelryService} from '../services/jewelry.service';
import {Expedition} from '../domain/expedition.model';
import {PlayerExpedition} from '../domain/playerExpedition.model';
import {ExpeditionProgressModal} from './expedition-progress-modal';
import {OddJobsModal} from './odd-jobs-modal';
import {MapSelectionPopover} from './map-selection-popover';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  storyNewPlayer = 'PLAYER_NEW';
  storyColorSelected = 'PLAYER_COLOR_SELECTED';

  saving = false;

  steamTimer = false;
  cogwheelsTimer = false;
  tokensTimer = false;

  buildings: Building[];

  rows: number[];

  mapFightFoundStory = 'MAP_FIGHT_REVEALED';
  mapChestFoundStory = 'MAP_CHEST_REVEALED';
  mapPortalFoundStory = 'MAP_PORTAL_REVEALED';
  victoriousRepeatableFightStory = 'REPEATABLE_FIGHT_WON';
  heroLevelledStory = 'HERO_LEVELLED';
  heroLevel5Story = 'HERO_LEVEL_5';
  heroLevel40maxStory = 'HERO_LEVEL_40_MAX';
  heroMaxLevelStory = 'HERO_MAX_LEVEL';
  heroAscLevelledStory = 'HERO_ASC_LEVELLED';

  constructor(public model: Model,
              private storyService: StoryService,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              private router: Router,
              public buildingService: BuildingService,
              public jewelryService: JewelryService,
              public converter: ConverterService,
              public propertyService: PropertyService,
              public modalCtrl: ModalController,
              private popoverCtrl: PopoverController) {}

  ionViewWillEnter(): void {
    this.calcRows();
    this.calcBuildings();
    this.checkStories();
  }

  private calcRows() {
    this.rows = Array.from({length: (this.model.currentMap.maxY - this.model.currentMap.minY + 1)}, (v, k) => k + this.model.currentMap.minY);
  }

  private calcBuildings() {
    this.buildings = [];
    this.addBuilding(this.model.getBuilding('BARRACKS'));
    this.addBuilding(this.model.getBuilding('ARENA'));
    this.addBuilding(this.model.getBuilding('ACADEMY'));
    this.addBuilding(this.model.getBuilding('LABORATORY'));
    this.addBuilding(this.model.getBuilding('FORGE'));
    this.addBuilding(this.model.getBuilding('GARAGE'));
    this.addBuilding(this.model.getBuilding('BAZAAR'));
    this.addBuilding(this.model.getBuilding('JEWELRY'));
    this.addBuilding(this.model.getBuilding('STORAGE'));
  }

  private addBuilding(building?: Building) {
    if (building) {
      this.buildings.push(building);
    }
  }

  getRow(y: number): PlayerMapTile[] {
    let knownRowTiles = this.model.currentMap.tiles.filter(t => t.posY === y);
    let tiles: PlayerMapTile[] = [];
    for (let i = this.model.currentMap.minX; i <= this.model.currentMap.maxX; i++) {
      let knownTile = knownRowTiles.find(t => t.posX === i);
      if (knownTile) {
        tiles.push(knownTile);
      } else {
        let emptyTile = new PlayerMapTile();
        emptyTile.posX = i;
        emptyTile.posY = y;
        emptyTile.discovered = false;
        emptyTile.discoverable = false;
        tiles.push(emptyTile);
      }
    }
    return tiles;
  }

  isEven(row: number): boolean {
    return Math.abs(row) % 2 === 0;
  }

  getTileMission(tile: PlayerMapTile): Mission {
    if (tile.fightRepeatable && tile.victoriousFight) {
      return this.model.missions.find(m => m.mapId === this.model.currentMap.mapId && m.posX === tile.posX && m.posY === tile.posY);
    }
  }

  selectTile(tile: PlayerMapTile) {
    if (tile.discoverable) {
      this.saving = true;
      this.backendService.discoverMapTile(this.model.currentMap.mapId, tile.posX, tile.posY).subscribe(() => {
        this.saving = false;
        this.checkStories();
      }, () => { this.saving = false; });
    } else if (tile.fightIcon) {
      let mission  = this.getTileMission(tile);
      if (mission) {
        this.openMission(mission);
      } else {
        this.router.navigateByUrl('/campaign/' + this.model.currentMap.mapId + '/' + tile.posX + '/' + tile.posY);
      }
    } else if (tile.structure) {
      if (tile.portalToMapId) {
        // change map to portalToMapId
        this.saving = true;
        let toMap = this.model.playerMaps.find(m => m.mapId === tile.portalToMapId);
        if (toMap) {
          this.backendService.setCurrentMap(toMap.mapId).subscribe(() => {
            this.calcRows();
            this.saving = false;
            this.showMapStory();
          }, () => { this.saving = false; });
        } else {
          this.backendService.discoverMap(tile.portalToMapId).subscribe(() => {
            this.calcRows();
            this.saving = false;
            this.showMapStory();
          }, () => { this.saving = false; });
        }

      } else if (tile.buildingType) {
        if (this.model.buildings.find(b => b.type === tile.buildingType)) {
          this.gotoBuilding(tile.buildingType);
        } else {
          this.saving = true;
          this.backendService.discoverBuilding(this.model.currentMap.mapId, tile.posX, tile.posY).subscribe(() => {
            this.saving = false;
            this.calcBuildings();
            let discoverStory = tile.buildingType + '_DISCOVERED';
            if (this.storyService.storyUnknown(discoverStory)) {
              this.storyService.showStory(discoverStory).subscribe(() => this.gotoBuilding(tile.buildingType));
            }
          });
        }
      } else if (!tile.chestOpened) {
        this.saving = true;
        this.backendService.openChest(this.model.currentMap.mapId, tile.posX, tile.posY).subscribe(() => {
          this.saving = false;
        }, () => { this.saving = false; });
      }
    }
  }

  showMapStory() {
    if (this.model.currentMap.storyTrigger && this.storyService.storyUnknown(this.model.currentMap.storyTrigger)) {
      this.storyService.showStory(this.model.currentMap.storyTrigger).subscribe(() => {
        console.log("HomePage map story shown");
      });
    }
  }

  checkStories() {
    if (this.storyService.storyUnknown(this.storyNewPlayer)) {
      this.storyService.showStory(this.storyNewPlayer).subscribe(() => {
        console.log("HomePage after new player story");
        this.ionViewWillEnter();
      });
    } else if (!this.model.player.color) {
      this.alertCtrl.create({
        subHeader: 'Select your hero color',
        backdropDismiss: false,
        buttons: [
          {text: 'Red', cssClass: 'RED', handler: () => this.saveColor('RED') },
          {text: 'Green', cssClass: 'GREEN', handler: () => this.saveColor('GREEN') },
          {text: 'Blue', cssClass: 'BLUE', handler: () => this.saveColor('BLUE') }
        ]
      }).then(alert => alert.present());
    } else if (this.storyService.storyUnknown(this.mapFightFoundStory) && this.model.currentMap.tiles.findIndex(t => t.discovered && !!t.fightIcon) !== -1) {
      this.storyService.showStory(this.mapFightFoundStory).subscribe(() => {
        console.log("HomePage map fight revealed story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.mapChestFoundStory) && this.mapHasUnopenedChest()) {
      this.storyService.showStory(this.mapChestFoundStory).subscribe(() => {
        console.log("HomePage map chest revealed story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.mapPortalFoundStory) && this.mapHasPortal()) {
      this.storyService.showStory(this.mapPortalFoundStory).subscribe(() => {
        console.log("HomePage map portal revealed story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.victoriousRepeatableFightStory) && this.mapHasVictoriousRepeatableFight()) {
      this.storyService.showStory(this.victoriousRepeatableFightStory).subscribe(() => {
        console.log("HomePage victorious repeatable fight story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.heroLevelledStory) && this.model.heroes.findIndex(h => h.level > 1) !== -1) {
      this.storyService.showStory(this.heroLevelledStory).subscribe(() => {
        console.log("HomePage hero levelled story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.heroLevel5Story) && this.model.vehicles.length > 0 && this.model.heroes.findIndex(h => h.level >= 5) !== -1) {
      this.storyService.showStory(this.heroLevel5Story).subscribe(() => {
        console.log("HomePage hero level 5 story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.heroLevel40maxStory) && this.model.heroes.findIndex(h => h.level === 40 && h.xp === h.maxXp) !== -1) {
      this.storyService.showStory(this.heroLevel40maxStory).subscribe(() => {
        console.log("HomePage hero level 40 max story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.heroMaxLevelStory) && this.model.heroes.findIndex(h => h.level === (10 * h.stars) && h.xp === h.maxXp) !== -1) {
      this.storyService.showStory(this.heroMaxLevelStory).subscribe(() => {
        console.log("HomePage hero max level story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.heroAscLevelledStory) && this.model.heroes.findIndex(h => h.ascLvl > 0) !== -1) {
      this.storyService.showStory(this.heroAscLevelledStory).subscribe(() => {
        console.log("HomePage hero asc levelled story shown");
        this.checkStories();
      });
    } else if (this.model.progress.level < 60 && this.model.progress.xp >= this.model.progress.maxXp) {
      this.saving = true;
      this.backendService.playerLevelUp().subscribe(() => {
        this.saving = false;
      });
    }
  }

  saveColor(color: string) {
    this.backendService.selectPlayerColor(color).subscribe(() => {
      if (this.storyService.storyUnknown(this.storyColorSelected)) {
        this.storyService.showStory(this.storyColorSelected).subscribe(() => {
          console.log("HomePage after color selection story");
          this.checkStories();
        });
      }
    });
  }

  mapHasUnopenedChest(): boolean {
    return this.model.currentMap.tiles.findIndex(t => t.discovered && !!t.structure && !t.portalToMapId && !t.buildingType && !t.chestOpened) !== -1;
  }

  mapHasVictoriousRepeatableFight(): boolean {
    return this.model.currentMap.tiles.findIndex(t => t.discovered && t.fightRepeatable && t.victoriousFight) !== -1;
  }

  mapHasPortal(): boolean {
    return this.model.currentMap.tiles.findIndex(t => t.discovered && !!t.portalToMapId) !== -1;
  }

  gotoBuilding(type: string) {
    switch(type) {
      case 'ACADEMY':
        this.router.navigateByUrl('/academy');
        break;
      case 'ARENA':
        this.router.navigateByUrl('/arena');
        break;
      case 'BARRACKS':
        this.router.navigateByUrl('/barracks');
        break;
      case 'BAZAAR':
        this.router.navigateByUrl('/bazaar');
        break;
      case 'FORGE':
        this.router.navigateByUrl('/forge');
        break;
      case 'GARAGE':
        this.router.navigateByUrl('/garage');
        break;
      case 'JEWELRY':
        this.router.navigateByUrl('/jewelry');
        break;
      case 'LABORATORY':
        this.router.navigateByUrl('/laboratory');
        break;
      case 'STORAGE':
        this.router.navigateByUrl('/storage');
        break;
      default:
        this.alertCtrl.create({
          subHeader: type + ' will be implemented soon.'
        }).then(alert => alert.present());
        break;
    }
  }

  gotoAccount() {
    this.router.navigateByUrl('/account');
  }

  getBuildingAlertCss(building: Building): string {
    if (this.buildingService.upgradeFinished(building.type)) { return 'alert'; }
    switch (building.type) {
      case 'ARENA':
        return 'none';
      case 'BARRACKS': {
        if (this.model.heroes.findIndex(h => h.skillPoints > 0) !== -1) { return 'alert'; }
        break;
      }
      case 'LABORATORY': {
        if (this.model.incubators.findIndex(i => i.finished) !== -1) { return 'alert'; }
        if (this.model.incubators.length < this.model.progress.incubators ) {
          if (this.model.resources.simpleGenome >= this.model.progress.simpleGenomesNeeded ||
              this.model.resources.commonGenome >= this.model.progress.commonGenomesNeeded ||
              this.model.resources.uncommonGenome >= this.model.progress.uncommonGenomesNeeded ||
              this.model.resources.rareGenome >= this.model.progress.rareGenomesNeeded ||
              this.model.resources.epicGenome >= this.model.progress.epicGenomesNeeded) {
            return 'info';
          }
        }
        break;
      }
      case 'FORGE': {
        let gearFinished = this.model.gears.filter(g => {
          if (g.modificationInProgress) {
            let idx = this.model.upgrades.findIndex(u => u.gearId === g.id);
            if (idx !== -1) {
              return this.model.upgrades[idx].finished;
            }
          }
          return false;
        });
        if (gearFinished.length > 0) { return 'alert'; }
        break;
      }
    }
    if (this.buildingService.upgradeInProgress(building.type)) { return 'progress'; }
    if (this.buildingService.freeUpgradeQueue() && this.buildingService.canEffortUpgradeBuilding(building.type)) { return 'info'; }
    return 'none';
  }

  getPlayerExpeditions(): PlayerExpedition[] {
    if (this.model.playerExpeditions && this.model.playerExpeditions.length > 0) {
      return this.model.playerExpeditions.filter(p => !p.completed);
    }
    return [];
  }

  openPlayerExpedition(playerExpedition: PlayerExpedition) {
    this.modalCtrl.create({
      component: ExpeditionProgressModal,
      componentProps: {
        playerExpedition: playerExpedition
      }
    }).then(modal => modal.present());
  }

  getAvailableExpeditions(): Expedition[] {
    if (this.model.progress.expeditionLevel > 0) {
      return this.model.expeditions.filter(e => this.model.playerExpeditions.findIndex(p => p.expeditionId === e.id) === -1);
    }
    return [];
  }

  openExpedition(expedition: Expedition) {
    this.router.navigateByUrl('/home/expedition/' + expedition.id);
  }

  getExpeditionDuration(expedition: Expedition): number {
    return (expedition.expeditionBase.durationMinutes * 60 * 100) / this.model.progress.expeditionSpeed;
  }

  openOddJobs() {
    this.modalCtrl.create({
      component: OddJobsModal
    }).then(modal => {
      modal.onDidDismiss().then(() => this.checkStories());
      modal.present();
    });
  }

  hasOddJobToClaim(): boolean {
    if (!!this.model.oddJobs.find(o => o.jobAmountDone >= o.jobAmount)) {
      return true;
    }
    for (let i = 1; i <= this.model.dailyActivity.today; i++) {
      if (!!this.model.dailyActivity['day' + i] && !this.model.dailyActivity['day' + i + 'claimed']) {
        return true;
      }
    }
    return !!this.model.achievementRewards.find(a => this.model.getAchievementAmount(a.achievementType) >= a.achievementAmount);
  }

  getMissionAlertCss(mission: Mission): string {
    if (mission.battles.findIndex(b => b.battleSuccess === false) !== -1) { return 'alert'; }
    if (mission.missionFinished) { return 'info'; }
    return 'none';
  }

  openMission(mission: Mission) {
    this.modalCtrl.create({
      component: MissionProgressModal,
      componentProps: {
        mission: mission
      }
    }).then(modal => modal.present());
  }

  toggleFavorite() {
    this.saving = true;
    this.backendService.setMapFavorite(this.model.currentMap.mapId, !this.model.currentMap.favorite).subscribe(() => {
      this.saving = false;
    }, () => this.saving = false );
  }

  mapSelection() {
    this.popoverCtrl.create({
      component: MapSelectionPopover,
      cssClass: 'widePopover'
    }).then(p => {
      p.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          this.saving = true;
          this.backendService.setCurrentMap(dataReturned.data).subscribe(() => {
            this.calcRows();
            this.saving = false;
          }, () => { this.saving = false; });
        }
      });
      p.present();
    });
  }

  resetMap() {
    this.alertCtrl.create({
      subHeader: 'Reset this map',
      inputs: [
        {
          name: 'discovered',
          type: 'checkbox',
          label: 'Discovery',
          value: 'discovered',
          checked: true
        },
        {
          name: 'fights',
          type: 'checkbox',
          label: 'Fights',
          value: 'fights',
          checked: true
        },
        {
          name: 'chests',
          type: 'checkbox',
          label: 'Chests',
          value: 'chests',
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.length > 0) {
              this.saving = true;
              let discovered = false, fights = false, chests = false;
              data.forEach(item => {
                if (item === 'discovered') { discovered = true; }
                if (item === 'fights') { fights = true; }
                if (item === 'chests') { chests = true; }
              });
              this.backendService.resetMap(this.model.currentMap.mapId, discovered, fights, chests).subscribe(() => {
                this.saving = false;
              }, () => { this.saving = false; });
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }


}
