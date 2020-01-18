import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {FightEnvironment} from '../domain/fightEnvironment.model';
import {FightEnvironmentModal} from './fightEnvironment.modal';

@Component({
  selector: 'fight-stage-environments',
  templateUrl: 'fightEnvironments.page.html'
})
export class FightEnvironmentsPage implements OnInit {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public model: Model) {
  }

  ngOnInit(): void {
    if (!this.model.fightEnvironments) {
      this.saving = true;
      this.backendService.loadFightEnvironments().subscribe(data => {
        this.model.fightEnvironments = data;
        this.saving = false;
      });
    }
  }

  showEnvironment(env: FightEnvironment) {
    this.modalCtrl.create({
      component: FightEnvironmentModal,
      componentProps: {
        environment: env
      }
    }).then(modal => modal.present());
  }

  newEnvironment() {
    this.alertCtrl.create({
      subHeader: 'New fight environment',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        }],
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
              this.backendService.createFightEnvironment(data.name).subscribe(config => {
                this.model.updateFightEnvironment(config);
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
}
