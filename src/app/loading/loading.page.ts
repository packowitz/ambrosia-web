import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {PropertyService} from '../services/property.service';
import {AdminEnums, Enums, EnumService} from '../services/enum.service';
import {LoadingState} from '../services/loadingState.service';
import {environment} from '../../environments/environment';
import {JewelryService} from '../services/jewelry.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['loading.page.scss']
})
export class LoadingPage {

  status: string;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private propertyService: PropertyService,
              private model: Model,
              private jewelryService: JewelryService,
              private router: Router,
              private enumService: EnumService,
              private loadingState: LoadingState) {
  }

  ionViewWillEnter() {
    this.status = "Initializing Ambrosia";
    this.initApp();
  }

  initApp() {
    if (!this.loadingState.playerLoaded) {
      this.loadPlayer();
    } else if (!this.loadingState.heroBaseLoaded) {
      this.loadBaseHeroes();
    } else if (!this.loadingState.vehicleBaseLoaded) {
      this.loadBaseVehicles();
    } else if (this.model.player.admin === true && !this.loadingState.serviceAccountsLoaded) {
      this.loadServiceAccounts();
    } else if (!this.loadingState.serviceAccountLoaded) {
      this.loadServiceAccount();
    } else if (!this.loadingState.enumsLoaded) {
      this.loadEnums();
    } else if (this.model.player.admin && !this.loadingState.adminEnumsLoaded) {
      this.loadAdminEnums();
    } else {
      let path = localStorage.getItem(environment.requestedPage);
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
      this.loadingState.enumsLoaded = true;
      this.initApp();
    }, error => {
      this.alertCtrl.create({
        subHeader: 'Failed to load static content from ambrosia server. Please reload page.'
      }).then(alert => alert.present());
    });
  }

  loadAdminEnums() {
    this.status = 'Loading admin static content';
    this.enumService.loadAdminEnums().subscribe((data: AdminEnums) => {
      this.enumService.adminEnums = data;
      this.loadingState.adminEnumsLoaded = true;
      this.initApp();
    }, error => {
      this.alertCtrl.create({
        subHeader: 'Failed to load admin static content from ambrosia server. Please reload page.'
      }).then(alert => alert.present());
    });
  }

  loadPlayer() {
    this.status = 'Loading player data';
    this.model.reset();
    this.jewelryService.reset();
    let token = localStorage.getItem(environment.tokenKey);
    if (!token) {
      this.router.navigateByUrl('/login');
    } else {
      this.backendService.getPlayer().subscribe(playerAction => {
        this.propertyService.init();
        this.model.playerName = playerAction.player.name;
        this.model.playerId = playerAction.player.id;
        this.model.activeAccountId = playerAction.player.id;
        this.loadingState.playerLoaded = true;
        this.initApp();
      }, error => {
        this.router.navigateByUrl('/login');
      });
    }
  }

  loadBaseHeroes() {
    this.status = 'Loading heroes';
    this.backendService.getHeroBases().subscribe(data => {
      this.model.baseHeroes = data;
      this.loadingState.heroBaseLoaded = true;
      this.initApp();
    });
  }

  loadBaseVehicles() {
    this.status = 'Loading vehicles';
    this.backendService.loadAllBaseVehicles().subscribe(data => {
      this.model.baseVehicles = data;
      this.loadingState.vehicleBaseLoaded = true;
      this.initApp();
    });
  }

  loadServiceAccount() {
    let serviceAccountId = localStorage.getItem(environment.serviceAccountIdKey);
    if (serviceAccountId) {
      this.status = 'Loading service account data';
      this.model.reset();
      this.jewelryService.reset();
      this.backendService.useServiceAccount(Number(serviceAccountId)).subscribe(data => {
        this.model.activeAccountId = data.player.id;
        this.model.useServiceAccount = true;
        this.loadingState.serviceAccountLoaded = true;
        this.initApp();
        console.log("Using service account " + data.player.name + " #" + data.player.id);
      });
    } else {
      this.loadingState.serviceAccountLoaded = true;
      this.initApp();
    }
  }

  loadServiceAccounts() {
    this.status = 'Loading service accounts';
    this.backendService.getAllServiceAccounts().subscribe(data => {
      this.model.serviceAccounts = data;
      this.loadingState.serviceAccountsLoaded = true;
      this.initApp();
    });
  }

}
