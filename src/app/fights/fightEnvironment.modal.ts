import {Component, Input} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ModalController} from '@ionic/angular';
import {FightStageConfig} from '../domain/fightStageConfig.model';
import {EnumService} from '../services/enum.service';
import {Model} from '../services/model.service';
import {FightEnvironment} from '../domain/fightEnvironment.model';

@Component({
    selector: 'fight-environment-modal',
    templateUrl: 'fightEnvironment.modal.html'
})
export class FightEnvironmentModal {

    @Input() environment: FightEnvironment;
    saving = false;

    constructor(private backendService: BackendService,
                public enumService: EnumService,
                private model: Model,
                private modalCtrl: ModalController) {

    }

    save() {
        this.saving = true;
        this.backendService.updateFightEnvironment(this.environment).subscribe(data => {
            this.environment = data;
            this.model.updateFightEnvironment(data);
            this.saving = false;
            this.dismiss();
        });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

}