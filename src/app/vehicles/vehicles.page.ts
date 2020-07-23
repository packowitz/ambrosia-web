import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Router} from '@angular/router';
import {VehicleBase} from '../domain/vehicleBase.model';

@Component({
  selector: 'vehicles',
  templateUrl: 'vehicles.page.html'
})
export class VehiclesPage {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public model: Model,
              public enumService: EnumService,
              private router: Router) {
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
