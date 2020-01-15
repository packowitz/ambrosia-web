import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {FightStageConfig} from '../domain/fightStageConfig.model';
import {GearModal} from '../barracks/gear.modal';
import {FightStageConfigModal} from './fightStageConfig.modal';

@Component({
  selector: 'fight-stage-configs',
  templateUrl: 'fightStageConfigs.page.html'
})
export class FightStageConfigsPage implements OnInit {

  saving = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public model: Model) {
  }

  ngOnInit(): void {
    if (!this.model.fightStageConfigs) {
      this.saving = true;
      this.backendService.loadFightStageConfigs().subscribe(data => {
        this.model.fightStageConfigs = data;
        this.saving = false;
      });
    }
  }

  showConfig(config: FightStageConfig) {
    this.modalCtrl.create({
      component: FightStageConfigModal,
      componentProps: {
        config: config
      }
    }).then(modal => modal.present());
  }

  newConfig() {
    this.alertCtrl.create({
      subHeader: 'New fight stage config',
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
              this.backendService.createFightStageConfig(data.name).subscribe(config => {
                this.model.fightStageConfigs.push(config);
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
