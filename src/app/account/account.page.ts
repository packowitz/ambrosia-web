import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {LoadingState} from '../services/loadingState.service';
import {PropertyService} from '../services/property.service';
import {BackendService} from '../services/backend.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html'
})
export class AccountPage {

  saving = false;

  constructor(public model: Model,
              private loadingState: LoadingState,
              private propertyService: PropertyService,
              private backendService: BackendService,
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

  expeditionsToNextLevel(): number {
    let props = this.propertyService.getProps('EXPEDITION_PROGRESS', this.model.progress.expeditionLevel);
    if (props && props.length > 0) {
      let toGo = props[0].value1 - this.model.achievements.expeditionsDone;
      return toGo > 0 ? toGo : 0;
    }
    return -1;
  }

  expLevelUp() {
    this.saving = true;
    this.backendService.expeditionLevelUp().subscribe(() => {
      this.saving = false;
    }, () => this.saving = false );
  }

}
