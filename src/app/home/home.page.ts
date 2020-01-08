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
export class HomePage implements OnInit {

  saving = false;
  map: PlayerMap;
  rows: number[];

  constructor(public model: Model,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              private router: Router) {}

  ngOnInit(): void {
    if (!this.model.currentMap) {
      this.saving = true;
      this.backendService.loadCurrentPlayerMap().subscribe(data => {
        this.model.updatePlayerMap(data);
        this.map = data;
        this.calcRows();
        this.saving = false;
      });
    } else {
      this.map = this.model.currentMap;
      this.calcRows();
    }
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
        this.model.updatePlayerMap(data);
        this.map = data;
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
            if (toMap.tiles) {
              this.model.currentMap = toMap;
              this.map = toMap;
              this.calcRows();
              this.saving = false;
            } else {
              this.backendService.getPlayerMap(toMap.mapId).subscribe(data => {
                this.model.currentMap = data;
                this.map = data;
                this.calcRows();
                this.saving = false;
              });
            }
          });
        } else {
          this.backendService.discoverMap(tile.portalToMapId).subscribe(data => {
            this.model.updatePlayerMap(data);
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
