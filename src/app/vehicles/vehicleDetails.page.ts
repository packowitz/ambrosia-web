import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {ConverterService} from '../services/converter.service';
import {VehicleBase} from '../domain/vehicleBase.model';
import {VehicleAvatarModal} from './vehicleAvatar.modal';

@Component({
  selector: 'vehicle-details',
  templateUrl: 'vehicleDetails.page.html'
})
export class VehicleDetailsPage {

  saving = false;

  vehicle: VehicleBase;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private backendService: BackendService,
              public model: Model,
              public enumService: EnumService,
              private converter: ConverterService,
              private modalCtrl: ModalController) {
  }

  ionViewWillEnter() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicle = this.converter.dataClone(this.model.baseVehicles.find(v => v.id === id));
  }

  save() {
    this.saving = true;
    this.backendService.saveBaseVehicle(this.vehicle).subscribe(data => {
      this.vehicle = this.converter.dataClone(data);
      this.model.updateVehicleBase(data);
      this.saving = false;
    }, () => { this.saving = false; });
  }

  cancel() {
    this.router.navigateByUrl('/vehiclebase');
  }

  changeAvatar(event) {
    event.stopPropagation();
    this.modalCtrl.create({
      component: VehicleAvatarModal,
      componentProps: {
        currentIcon: this.vehicle.avatar
      }
    }).then(modal => {
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          this.vehicle.avatar = dataReturned.data;
        }
      });
      modal.present();
    });
  }
}
