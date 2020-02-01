import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Player} from '../domain/player.model';
import {Router} from '@angular/router';
import {Fight} from '../domain/fight.model';
import {Map} from '../domain/map.model';
import {LootBox} from '../domain/lootBox.model';
import {GearLoot} from '../domain/gearLoot.model';

@Component({
  selector: 'gear-loot',
  templateUrl: 'gearLoot.page.html'
})
export class GearLootPage implements OnInit {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.model.gearLoots) {
      this.saving = true;
      this.backendService.loadAllGearLoots().subscribe(data => {
        this.model.gearLoots = data;
        this.saving = false;
      });
    }
  }

  newGearLootBox() {
    this.alertCtrl.create({
      subHeader: 'New gear loot',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
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
            if (data.name) {
              this.saving = true;
              this.backendService.newGearLoot(data.name).subscribe(gearLoot => {
                this.model.gearLoots.push(gearLoot);
                this.saving = false;
              });
            }
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  gearLootDetails(gearLoot: GearLoot) {
    this.router.navigateByUrl('/loot/gear/' + gearLoot.id);
  }
}
