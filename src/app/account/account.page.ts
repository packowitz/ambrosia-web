import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {LoadingState} from '../services/loadingState.service';
import {BackendService} from '../services/backend.service';
import {ModalController} from '@ionic/angular';
import {PlayerLevelInfoModal} from './player-level-info.modal';
import {VipLevelInfoModal} from './vip-level-info.modal';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html'
})
export class AccountPage {

  saving = false;

  constructor(public model: Model,
              private loadingState: LoadingState,
              private backendService: BackendService,
              private router: Router,
              private modalCtrl: ModalController) { }

  close() {
    this.router.navigateByUrl('/home');
  }

  showLevelUpInfo() {
    this.modalCtrl.create({component: PlayerLevelInfoModal}).then(m => m.present() );
  }

  showVipLevelInfo() {
    this.modalCtrl.create({component: VipLevelInfoModal}).then(m => m.present() );
  }

  logout() {
    let key = environment.tokenKey;
    if (this.model.player.serviceAccount) {
      key = environment.serviceTokenKey;
    }
    localStorage.removeItem(key);
    this.model.useServiceAccount = false;
    this.loadingState.playerLoaded = false;
    this.router.navigateByUrl('/loading');
  }

}
