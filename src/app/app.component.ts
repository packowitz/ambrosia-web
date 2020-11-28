import {Component} from '@angular/core';

import {AlertController, MenuController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {BackendService} from './services/backend.service';
import {Model} from './services/model.service';
import {environment} from '../environments/environment';
import {LoadingState} from './services/loadingState.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public pages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'gemini'
        },
        {
            title: 'Properties',
            url: '/properties',
            icon: 'flower',
            admin: true
        },
        {
            title: 'Base heroes',
            url: '/herobase/list',
            path: '/herobase/',
            icon: 'player'
        },
        {
            title: 'Vehicles',
            url: '/vehiclebase',
            icon: 'jetpack'
        },
        {
            title: 'Fights',
            url: '/fights',
            icon: 'hydra',
            open: false,
            children: [
                {
                    title: 'Stage Configs',
                    url: '/fights/configs',
                    icon: 'cog'
                },
                {
                    title: 'Environments',
                    url: '/fights/environments',
                    icon: 'defibrillate'
                }
            ]
        },
        {
            title: 'Maps',
            url: '/maps',
            icon: 'honeycomb'
        },
        {
            title: 'Loot',
            url: '/loot',
            icon: 'trophy',
            open: false,
            children: [
                {
                    title: 'Gear Loot',
                    url: '/loot/gear',
                    icon: 'vest'
                }
            ]
        },
        {
            title: 'Tavern',
            url: '/tavern',
            icon: 'beer'
        },
        {
            title: 'Training',
            url: '/training',
            icon: 'crossed-axes'
        },
        {
            title: 'Story',
            url: '/story',
            icon: 'book'
        },
        {
            title: 'Expeditions',
            url: '/expeditions',
            icon: 'wooden-sign'
        },
        {
            title: 'Odd Jobs',
            url: '/oddjobs',
            icon: 'rune-stone'
        },
        {
            title: 'Merchant',
            url: '/merchant',
            icon: 'apple'
        },
        {
            title: 'Black Market',
            url: '/blackmarket',
            icon: 'three-keys'
        },
        {
            title: 'Tasks',
            url: '/tasks',
            icon: 'trophy'
        },
        {
            title: 'Ongoing Battle',
            url: '/battle',
            icon: 'dripping-sword'
        }
    ];

    constructor(
        private platform: Platform,
        private backendService: BackendService,
        public model: Model,
        private router: Router,
        private alertCtrl: AlertController,
        private loadingState: LoadingState,
        private menuCtrl: MenuController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log("App.initializeApp");
            let path: string = window.location.pathname;
            console.log("App.detected path: " + path);
            this.pages.forEach(p => {
                if (p.path && path.startsWith(p.path)) {
                    p.open = true;
                }
            });
            localStorage.setItem(environment.requestedPage, path);

            this.router.navigateByUrl('/loading');
        });
    }

    addServiceAccount() {
        this.alertCtrl.create({
            subHeader: 'New Service Account',
            inputs: [
                {
                    name: 'name',
                    label: 'Name',
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
                            this.backendService.createServiceAccount(data.name);
                        }
                    }
                }
            ]
        }).then(alert => {
            alert.present();
        });
    }

    loadAccountData() {
        if (this.model.playerId === this.model.activeAccountId) {
            localStorage.removeItem(environment.serviceTokenKey);
            localStorage.removeItem(environment.serviceAccountIdKey);
            this.model.useServiceAccount = false;
            this.loadingState.playerLoaded = false;
        } else {
            let localStorageAccountId = localStorage.getItem(environment.serviceAccountIdKey);
            if (Number(localStorageAccountId) !== this.model.activeAccountId) {
                localStorage.setItem(environment.serviceAccountIdKey, '' + this.model.activeAccountId);
                this.loadingState.serviceAccountLoaded = false;
            } else {
                return;
            }
        }
        console.log("account change detected");
        localStorage.setItem(environment.requestedPage, window.location.pathname);
        this.menuCtrl.toggle();
        this.router.navigateByUrl('/loading');
    }
}
