import { Component, OnInit } from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';
import {PropertyService} from '../services/property.service';
import {EnumService} from '../services/enum.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['loading.page.scss']
})
export class LoadingPage {

  playerLoaded = false;
  serviceAccountsLoaded = false;
  playerChecked = false;
  playerMapsLoaded = false;
  playerCurrentMapLoaded = false;
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
    } else if (this.model.player.admin && !this.serviceAccountsLoaded) {
      this.loadServiceAccounts();
    } else if (!this.playerChecked) {
      this.checkPlayer();
    } else if (this.enumService.enumsLoaded < this.enumService.enumsTotal) {
      this.status = 'Waiting for static content to get loaded';
      while (this.enumService.enumsLoaded < this.enumService.enumsTotal && !this.enumService.enumsFailed) {
        setTimeout(() => this.initApp(), 200);
      }
      if (this.enumService.enumsFailed) {
        this.alertCtrl.create({
          subHeader: 'Failed to load static content from ambrosia server. Please reload page.'
        }).then(alert => alert.present());
      }
    } else if(!this.playerMapsLoaded) {
      this.loadPlayerMaps();
    } else if(!this.playerCurrentMapLoaded) {
      this.loadCurrentPlayerMap();
    } else {
      let path = localStorage.getItem('ambrosia-page-requested');
      if (path && path.length > 1 && path.startsWith('/') && path !== '/loading' && path !== '/login') {
        this.router.navigateByUrl(path);
      } else {
        this.router.navigateByUrl('/home');
      }
    }
  }

  loadPlayer() {
    this.status = 'Loading player data';
    this.backendService.getPlayer().subscribe(playerAction => {
      this.propertyService.loadInitialProperties();
      this.model.playerName = playerAction.player.name;
      this.model.playerId = playerAction.player.id;
      this.model.activeAccountId = playerAction.player.id;
      this.playerLoaded = true;
      console.log("LoadingPage.LoadPlayer successfully completed");
      this.initApp();
    }, error => {
      console.log('auth failed goto login page');
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

  checkPlayer() {
    if (!this.model.player.color) {
      this.alertCtrl.create({
        subHeader: 'Select your hero color',
        buttons: [
          {text: 'Red', cssClass: 'RED', handler: () => this.saveColor('RED') },
          {text: 'Green', cssClass: 'GREEN', handler: () => this.saveColor('GREEN') },
          {text: 'Blue', cssClass: 'BLUE', handler: () => this.saveColor('BLUE') }
        ]
      }).then(alert => alert.present());
    } else {
      this.playerChecked = true;
      this.initApp();
    }
  }

  saveColor(color: string) {
    this.status = 'Updating player';
    this.backendService.selectPlayerColor(color).subscribe(() => {
      this.initApp();
    });
  }

  loadPlayerMaps() {
    this.status = "Loading maps";
    this.backendService.loadPlayerMaps().subscribe(data => {
      this.model.playerMaps = data;
      this.playerMapsLoaded = true;
      this.initApp();
    });
  }

  loadCurrentPlayerMap() {
    this.status = "Loading current map";
    this.backendService.loadCurrentPlayerMap().subscribe(data => {
      this.model.updatePlayerMap(data);
      this.playerCurrentMapLoaded = true;
      this.initApp();
    });
  }

}
