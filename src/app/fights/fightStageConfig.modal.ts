import {Component, Input} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ModalController} from '@ionic/angular';
import {FightStageConfig} from '../domain/fightStageConfig.model';

@Component({
    selector: 'fight-stage-config-modal',
    templateUrl: 'fightStageConfig.modal.html'
})
export class FightStageConfigModal {

    @Input() config: FightStageConfig;

    constructor(private backendService: BackendService,
                private modalCtrl: ModalController) {

    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

}