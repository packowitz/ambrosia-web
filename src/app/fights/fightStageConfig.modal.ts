import {Component, Input} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ModalController} from '@ionic/angular';
import {FightStageConfig} from '../domain/fightStageConfig.model';
import {EnumService} from '../services/enum.service';
import {Model} from '../services/model.service';

@Component({
    selector: 'fight-stage-config-modal',
    templateUrl: 'fightStageConfig.modal.html'
})
export class FightStageConfigModal {

    @Input() config: FightStageConfig;
    saving = false;

    constructor(private backendService: BackendService,
                public enumService: EnumService,
                private model: Model,
                private modalCtrl: ModalController) {

    }

    save() {
        this.saving = true;
        this.backendService.updateFightStageConfig(this.config).subscribe(data => {
            this.config = data;
            this.model.updateFightStageConfig(data);
            this.saving = false;
        });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

}