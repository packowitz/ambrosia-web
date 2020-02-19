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
import {VehicleBase} from '../domain/vehicleBase.model';

@Component({
  selector: 'vehicles',
  templateUrl: 'vehicles.page.html'
})
export class VehiclesPage implements OnInit {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.model.baseVehicles) {
      this.saving = true;
      this.backendService.loadAllBaseVehicles().subscribe(data => {
        this.model.baseVehicles = data;
        this.saving = false;
      });
    }
  }

  newVehicle() {
    this.alertCtrl.create({
      subHeader: 'New vehicle',
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
              this.backendService.newBaseVehicle(data.name).subscribe(vehicle => {
                this.model.updateVehicleBase(vehicle);
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

  vehicleDetails(vehicle: VehicleBase) {
    this.router.navigateByUrl('/vehiclebase/' + vehicle.id);
  }
}
