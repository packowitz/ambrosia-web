import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Router} from '@angular/router';
import {LootBox} from '../domain/lootBox.model';

@Component({
  selector: 'loot',
  templateUrl: 'loot.page.html'
})
export class LootPage implements OnInit {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.model.lootBoxes) {
      this.saving = true;
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
        this.saving = false;
      });
    }
  }

  newLootBox() {
    this.alertCtrl.create({
      subHeader: 'New loot box',
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
              this.backendService.saveLootBox({name: data.name}).subscribe(lootBox => {
                this.model.lootBoxes.push(lootBox);
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

  lootBoxDetails(lootBox: LootBox) {
    this.router.navigateByUrl('/loot/box/' + lootBox.id);
  }
}
