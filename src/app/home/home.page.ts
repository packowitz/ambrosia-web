import {Component, OnInit} from '@angular/core';
import {Model} from '../services/model.service';
import {PlayerMap} from '../domain/playerMap.model';
import {PlayerMapTile} from '../domain/playerMapTile.model';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  saving = false;
  map: PlayerMap;
  rows: number[];

  constructor(private model: Model,
              private backendService: BackendService,
              private alertCtrl: AlertController) {}

  ngOnInit(): void {
    this.map = this.model.playerMaps.find(m => m.mapId === this.model.player.currentMapId);
    this.rows = Array.from({length: (this.map.maxY - this.map.minY + 1)}, (v, k) => k + this.map.minY);
    console.log(this.rows);
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
        this.map = data;
        this.model.updatePlayerMap(data);
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
      // initiate fight
    } else if (tile.structure) {
      if (tile.portalToMapId) {
        // jump to map
      } else {
        // goto building
      }
    }
  }


}
