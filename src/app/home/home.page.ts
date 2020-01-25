import {Component, OnInit} from '@angular/core';
import {Model} from '../services/model.service';
import {PlayerMapTile} from '../domain/playerMapTile.model';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {PlayerMap} from '../domain/playerMap.model';
import {Router} from '@angular/router';
import {Building} from '../domain/building.model';
import {ConverterService} from '../services/converter.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  saving = false;

  steamTimer = false;
  cogwheelsTimer = false;
  tokensTimer = false;

  buildings: Building[];

  map: PlayerMap;
  rows: number[];

  constructor(public model: Model,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              private router: Router,
              private converter: ConverterService) {}

  ionViewWillEnter(): void {
    this.map = this.model.currentMap;
    this.calcRows();
    this.calcBuildings();
  }

  private calcRows() {
    this.rows = Array.from({length: (this.map.maxY - this.map.minY + 1)}, (v, k) => k + this.map.minY);
  }

  private calcBuildings() {
    this.buildings = [];
    this.addBuilding(this.model.buildings.find(b => b.type === 'BARRACKS'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'ARENA'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'ACADEMY'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'LABORATORY'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'FORGE'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'GARAGE'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'BAZAAR'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'JEWELRY'));
    this.addBuilding(this.model.buildings.find(b => b.type === 'STORAGE_0'));
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
      }, error => {
        this.saving = false;
        this.alertCtrl.create({
          header: 'Server error',
          message: error.error.message,
          buttons: [{text: 'Okay'}]
        }).then(data => data.present());
      });
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
          });
        } else {
          this.backendService.discoverMap(tile.portalToMapId).subscribe(data => {
            this.map = data.currentMap;
            this.calcRows();
            this.saving = false;
          });
        }

      } else if (tile.buildingType) {
        if (this.model.buildings.find(b => b.type === tile.buildingType)) {
          this.gotoBuilding(tile.buildingType);
        } else {
          this.saving = true;
          this.backendService.discoverBuilding(this.map.mapId, tile.posX, tile.posY).subscribe(data => {
            this.saving = false;
            this.calcBuildings();
            this.alertCtrl.create({
              subHeader: 'You discovered a new building: The ' + tile.buildingType + '. Go and check it out',
              buttons: [
                {text: 'Check it out', handler: () => this.gotoBuilding(tile.buildingType)}
              ]
            }).then(alert => alert.present());
          });
        }
      }
    }
  }

  gotoBuilding(type: string) {
    switch(type) {
      case 'BARRACKS':
        this.router.navigateByUrl('/barracks');
        break;
      default:
        this.alertCtrl.create({
          subHeader: type + ' will be implemented soon.'
        }).then(alert => alert.present());
        break;
    }
  }


}
