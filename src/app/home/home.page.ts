import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {PlayerMapTile} from '../domain/playerMapTile.model';
import {BackendService} from '../services/backend.service';
import {AlertController, ModalController} from '@ionic/angular';
import {PlayerMap} from '../domain/playerMap.model';
import {Router} from '@angular/router';
import {Building} from '../domain/building.model';
import {ConverterService} from '../services/converter.service';
import {PropertyService} from '../services/property.service';
import {Mission} from '../domain/mission.model';
import {MissionProgressModal} from './mission-progress-modal';
import {StoryService} from '../services/story.service';

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

  map: PlayerMap;
  rows: number[];

  mapFightFoundStory = 'MAP_FIGHT_REVEALED';
  mapChestFoundStory = 'MAP_CHEST_REVEALED';
  victoriousRepeatableFightStory = 'REPEATABLE_FIGHT_WON';
  heroLevelledStory = 'HERO_LEVELLED';
  heroMaxLevelStory = 'HERO_MAX_LEVEL';
  heroAscLevelledStory = 'HERO_ASC_LEVELLED';

  constructor(public model: Model,
              private storyService: StoryService,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              private router: Router,
              public converter: ConverterService,
              public propertyService: PropertyService,
              public modalCtrl: ModalController) {}

  ionViewWillEnter(): void {
    this.checkStories();
    this.map = this.model.currentMap;
    this.calcRows();
    this.calcBuildings();
  }

  private calcRows() {
    this.rows = Array.from({length: (this.map.maxY - this.map.minY + 1)}, (v, k) => k + this.map.minY);
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
    return this.map.tiles.filter(t => t.posY === y).sort((a, b) => a.posX - b.posX);
  }

  isEven(row: number): boolean {
    return Math.abs(row) % 2 === 0;
  }

  selectTile(tile: PlayerMapTile) {
    if (tile.discoverable) {
      this.saving = true;
      this.backendService.discoverMapTile(this.map.mapId, tile.posX, tile.posY).subscribe(data => {
        this.map = data.currentMap;
        this.saving = false;
        this.checkStories();
      }, () => { this.saving = false; });
    } else if (tile.fightIcon) {
      this.router.navigateByUrl('/campaign/' + this.map.mapId + '/' + tile.posX + '/' + tile.posY);
    } else if (tile.structure) {
      if (tile.portalToMapId) {
        // change map to portalToMapId
        this.saving = true;
        let toMap = this.model.playerMaps.find(m => m.mapId === tile.portalToMapId);
        if (toMap) {
          this.backendService.setCurrentMap(toMap.mapId).subscribe(() => {
            this.map = this.model.currentMap;
            this.calcRows();
            this.saving = false;
            this.showMapStory();
          }, () => { this.saving = false; });
        } else {
          this.backendService.discoverMap(tile.portalToMapId).subscribe(data => {
            this.map = data.currentMap;
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
          this.backendService.discoverBuilding(this.map.mapId, tile.posX, tile.posY).subscribe(data => {
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
        this.backendService.openChest(this.map.mapId, tile.posX, tile.posY).subscribe(data => {
          this.saving = false;
          this.map = data.currentMap;
        }, () => { this.saving = false; });
      }
    }
  }

  showMapStory() {
    if (this.map.storyTrigger && this.storyService.storyUnknown(this.map.storyTrigger)) {
      this.storyService.showStory(this.map.storyTrigger).subscribe(() => {
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
    } else if (this.storyService.storyUnknown(this.mapFightFoundStory) && this.map.tiles.findIndex(t => t.discovered && !!t.fightIcon) !== -1) {
      this.storyService.showStory(this.mapFightFoundStory).subscribe(() => {
        console.log("HomePage map fight revealed story shown");
        this.checkStories();
      });
    } else if (this.storyService.storyUnknown(this.mapChestFoundStory) && this.mapHasUnopenedChest()) {
      this.storyService.showStory(this.mapChestFoundStory).subscribe(() => {
        console.log("HomePage map chest revealed story shown");
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
    return this.map.tiles.findIndex(t => t.discovered && !!t.structure && !t.portalToMapId && !t.buildingType && !t.chestOpened) !== -1;
  }

  mapHasVictoriousRepeatableFight(): boolean {
    return this.map.tiles.findIndex(t => t.discovered && t.fightRepeatable && t.victoriousFight) !== -1;
  }

  gotoBuilding(type: string) {
    switch(type) {
      case 'ACADEMY':
        this.router.navigateByUrl('/academy');
        break;
      case 'BARRACKS':
        this.router.navigateByUrl('/barracks');
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

  openMission(mission: Mission) {
    this.modalCtrl.create({
      component: MissionProgressModal,
      componentProps: {
        mission: mission
      }
    }).then(modal => modal.present());
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
              this.backendService.resetMap(this.map.mapId, discovered, fights, chests).subscribe(response => {
                this.map = response.currentMap;
                this.saving = false;
              }, () => { this.saving = false; });
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }


}
