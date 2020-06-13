import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {LoadingState} from '../services/loadingState.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html'
})
export class AccountPage {

  constructor(public model: Model,
              private loadingState: LoadingState,
              private router: Router) { }

  close() {
    this.router.navigateByUrl('/home');
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
