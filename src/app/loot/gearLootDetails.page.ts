import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService, MapTileStructure, ResourceType} from '../services/enum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Map} from '../domain/map.model';
import {MapTile} from '../domain/mapTile.model';
import {AlertController} from '@ionic/angular';
import {LootBox} from '../domain/lootBox.model';
import {LootItem} from '../domain/lootItem.model';
import {ConverterService} from '../services/converter.service';
import {GearLoot} from '../domain/gearLoot.model';

@Component({
  selector: 'gear-loot-details',
  templateUrl: 'gearLootDetails.page.html'
})
export class GearLootDetailsPage {

  saving = false;

  gearLoot: GearLoot;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private backendService: BackendService,
              public model: Model,
              public enumService: EnumService,
              public alertCtrl: AlertController,
              private converter: ConverterService) {
  }

  ionViewWillEnter() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.model.gearLoots) {
      this.saving = true;
      this.backendService.loadAllGearLoots().subscribe(data => {
        this.model.gearLoots = data;
        this.gearLoot = this.converter.dataClone(this.model.gearLoots.find(m => m.id === id));
        this.saving = false;
      });
    } else {
      this.gearLoot = this.converter.dataClone(this.model.gearLoots.find(m => m.id === id));
    }
  }

  save() {
    this.saving = true;
    this.backendService.saveGearLoot(this.gearLoot).subscribe(data => {
      this.gearLoot = this.converter.dataClone(data);
      this.model.updateGearLoot(data);
      this.saving = false;
    }, error => {
      this.saving = false;
      this.alertCtrl.create({
        header: 'Server error',
        message: error.error.message,
        buttons: [{text: 'Okay'}]
      }).then(data => data.present());
    });
  }

  cancel() {
    this.router.navigateByUrl('/loot/gear');
  }

  toggleSet(set: string) {
    let idx = this.gearLoot.sets.indexOf(set);
    if (idx >= 0) {
      this.gearLoot.sets.splice(idx, 1);
    } else {
      this.gearLoot.sets.push(set);
    }
  }

  setEnabled(set: string): boolean {
    return this.gearLoot.sets.indexOf(set) !== -1;
  }

  toggleType(type: string) {
    let idx = this.gearLoot.types.indexOf(type);
    if (idx >= 0) {
      this.gearLoot.types.splice(idx, 1);
    } else {
      this.gearLoot.types.push(type);
    }
  }

  typeEnabled(set: string): boolean {
    return this.gearLoot.types.indexOf(set) !== -1;
  }
}
