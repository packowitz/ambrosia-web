import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {PropertyService} from '../services/property.service';
import {Enums, EnumService} from '../services/enum.service';
import {API_URL} from '../../environments/environment';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['loading.page.scss']
})
export class LoadingPage {

  playerLoaded = false;
  serviceAccountsLoaded = false;
  enumsLoaded = false;
  status = "Initializing Ambrosia";

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private propertyService: PropertyService,
              private model: Model,
              private router: Router,
              private enumService: EnumService) {
    this.initApp();
  }

  initApp() {
    if (!this.playerLoaded) {
      this.loadPlayer();
    } else if (this.model.player.admin === true && !this.serviceAccountsLoaded) {
      this.loadServiceAccounts();
    } else if (!this.enumsLoaded) {
      this.loadEnums();
    } else {
      let path = localStorage.getItem('ambrosia-page-requested');
      if (!path.startsWith('/battle') && this.model.ongoingBattle) {
        this.alertCtrl.create({
          subHeader: 'You have an unfinished battle',
          backdropDismiss: false,
          buttons: [
            {text: 'Go to battle', handler: () => this.router.navigateByUrl('/battle')}
          ]
        }).then(alert => alert.present());
      } else {
        if (path && path.length > 1 && path.startsWith('/') && path !== '/loading' && path !== '/login') {
          this.router.navigateByUrl(path);
        } else {
          this.router.navigateByUrl('/home');
        }
      }
    }
  }

  loadEnums() {
    this.status = 'Loading static content';
    this.enumService.loadEnums().subscribe((data: Enums) => {
      this.enumService.enums = data;
      this.enumsLoaded = true;
      this.initApp();
    }, error => {
      this.alertCtrl.create({
        subHeader: 'Failed to load static content from ambrosia server. Please reload page.'
      }).then(alert => alert.present());
    });
  }

  loadPlayer() {
    this.status = 'Loading player data';
    this.backendService.getPlayer().subscribe(playerAction => {
      this.propertyService.loadInitialProperties();
      this.model.playerName = playerAction.player.name;
      this.model.playerId = playerAction.player.id;
      this.model.activeAccountId = playerAction.player.id;
      this.playerLoaded = true;
      this.initApp();
    }, error => {
      this.router.navigateByUrl('/login');
    });
  }

  loadServiceAccounts() {
    this.status = 'Loading service accounts';
    this.backendService.getAllServiceAccounts().subscribe(data => {
      this.model.serviceAccounts = data;
      this.serviceAccountsLoaded = true;
      this.initApp();
    });
  }

}
