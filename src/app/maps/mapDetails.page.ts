import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService, MapTileStructure} from '../services/enum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Map} from '../domain/map.model';
import {MapTile} from '../domain/mapTile.model';
import {ConverterService} from '../services/converter.service';

@Component({
  selector: 'map-details',
  templateUrl: 'mapDetails.page.html'
})
export class MapDetailsPage implements OnInit {

  saving = false;
  overlay = 'none';

  map: Map;
  isCurrentStartingMap = false;

  rows: number[] = [];

  tile: MapTile;
  tileStructureType: string;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              public model: Model,
              public enumService: EnumService,
              private converter: ConverterService,
              private router: Router) {
  }

  ngOnInit() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.model.maps) {
      this.saving = true;
      this.backendService.loadAllMaps().subscribe(data => {
        this.model.maps = data;
        this.setMap(this.model.maps.find(m => m.id === id));
        this.saving = false;
      });
    } else {
      this.setMap(this.model.maps.find(m => m.id === id));
    }
    if (!this.model.fights) {
      this.backendService.loadFights().subscribe(data => {
        this.model.fights = data;
      });
    }
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  private setMap(map: Map) {
    this.map = this.converter.dataClone(map);
    this.isCurrentStartingMap = this.map.startingMap;
    this.rows = Array.from({length: (map.maxY - map.minY + 1)}, (v, k) => k + map.minY);
    if (this.tile) {
      this.selectTile(this.map.tiles.find(t => t.posX === this.tile.posX && t.posY === this.tile.posY));
    }
  }

  cancel() {
    this.router.navigateByUrl('/maps');
  }

  getRow(y: number): MapTile[] {
    return this.map.tiles.filter(t => t.posY === y).sort((a, b) => a.posX - b.posX);
  }

  isEven(row: number): boolean {
    return Math.abs(row) % 2 === 0;
  }

  selectTile(tile: MapTile) {
    this.tile = tile;
    if (tile.portalToMapId) {
      this.tileStructureType = 'portal';
    } else if (tile.buildingType) {
      this.tileStructureType = 'building';
    } else if (tile.lootBoxId) {
      this.tileStructureType = 'chest';
    } else {
      this.tileStructureType = 'none';
    }
  }

  structureTypeChanged() {
    if (this.tileStructureType !== 'portal') {
      this.tile.portalToMapId = null;
    }
    if (this.tileStructureType !== 'building') {
      this.tile.buildingType = null;
    }
    if (this.tileStructureType !== 'chest') {
      this.tile.lootBoxId = null;
    }
    if (this.tileStructureType === 'none') {
      this.tile.structure = null;
    }
  }

  isSelected(tile: MapTile): boolean {
    return this.tile && this.tile.posX === tile.posX && this.tile.posY === tile.posY;
  }

  private newTile(x: number, y: number): MapTile {
    let tile = new MapTile();
    tile.type = 'NONE';
    tile.posX = x;
    tile.posY = y;
    tile.alwaysRevealed = false;
    return tile;
  }

  addTopRow() {
    this.map.minY--;
    this.rows.unshift(this.map.minY);
    let x;
    for (x = this.map.minX; x <= this.map.maxX; x++) {
      this.map.tiles.push(this.newTile(x, this.map.minY));
    }
  }

  removeTopRow() {
    let removedY = this.map.minY;
    this.map.minY++;
    this.rows.shift();
    this.map.tiles = this.map.tiles.filter(t => t.posY !== removedY);
  }

  addBottomRow() {
    this.map.maxY++;
    this.rows.push(this.map.maxY);
    let x;
    for (x = this.map.minX; x <= this.map.maxX; x++) {
      this.map.tiles.push(this.newTile(x, this.map.maxY));
    }
  }

  removeBottomRow() {
    let removedY = this.map.maxY;
    this.map.maxY--;
    this.rows.pop();
    this.map.tiles = this.map.tiles.filter(t => t.posY !== removedY);
  }

  addLeftColumn() {
    this.map.minX--;
    let y;
    for (y = this.map.minY; y <= this.map.maxY; y++) {
      this.map.tiles.push(this.newTile(this.map.minX, y));
    }
  }

  removeLeftColumn() {
    let removedX = this.map.minX;
    this.map.minX++;
    this.map.tiles = this.map.tiles.filter(t => t.posX !== removedX);
  }

  addRightColumn() {
    this.map.maxX++;
    let y;
    for (y = this.map.minY; y <= this.map.maxY; y++) {
      this.map.tiles.push(this.newTile(this.map.maxX, y));
    }
  }

  removeRightColumn() {
    let removedX = this.map.maxX;
    this.map.maxX--;
    this.map.tiles = this.map.tiles.filter(t => t.posX !== removedX);
  }

  fightIconChanged() {
    if (!this.tile.fightIcon) {
      this.tile.fightId = null;
    }
  }

  fightChanged() {
    if (!this.tile.fightId) {
      this.tile.fightIcon = null;
    }
  }

  portalIcons(): MapTileStructure[] {
    return this.enumService.getMapTileStructures().filter(s => s.type === 'PORTAL');
  }

  buildingIcons(): MapTileStructure[] {
    return this.enumService.getMapTileStructures().filter(s => s.type === 'BUILDING');
  }

  chestIcons(): MapTileStructure[] {
    return this.enumService.getMapTileStructures().filter(s => s.type === 'CHEST');
  }

  fightName(fightId): string {
    let name = '?';
    if (this.model.fights) {
      let fight = this.model.fights.find(f => f.id === fightId);
      if (fight) {
        name = fight.name;
      }
    }
    return name;
  }

  fightRecLvl(fightId): string {
    let lvl = '?';
    if (this.model.fights) {
      let fight = this.model.fights.find(f => f.id === fightId);
      if (fight) {
        lvl = '' + fight.level;
      }
    }
    return lvl;
  }

  save() {
    this.saving = true;
    if (this.map.intervalFrom) {
      this.map.intervalFrom = this.map.intervalFrom.substr(0, 16);
    }
    if (this.map.intervalTo) {
      this.map.intervalTo = this.map.intervalTo.substr(0, 16);
    }
    this.backendService.saveMap(this.map).subscribe(data => {
      this.setMap(data);
      this.model.updateMap(data);
      this.saving = false;
    }, () => { this.saving = false; });
  }

  possibleYears() {
    let thisYear = (new Date()).getFullYear();
    return thisYear + ',' + (thisYear + 1);
  }
}
