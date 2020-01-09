import {Component, OnInit} from '@angular/core';
import {Model} from '../services/model.service';
import {PlayerMapTile} from '../domain/playerMapTile.model';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {PlayerMap} from '../domain/playerMap.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  saving = false;
  map: PlayerMap;
  rows: number[];

  constructor(public model: Model,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              private router: Router) {}

  ionViewWillEnter(): void {
    this.map = this.model.currentMap;
    this.calcRows();
  }

  private calcRows() {
    this.rows = Array.from({length: (this.map.maxY - this.map.minY + 1)}, (v, k) => k + this.map.minY);
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

      } else {
        // goto building
      }
    }
  }


}
