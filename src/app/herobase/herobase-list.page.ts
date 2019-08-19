import {Component, OnInit} from '@angular/core';
import {EnumService} from '../services/enum.service';
import {BackendService} from '../services/backend.service';
import {ToastController} from '@ionic/angular';
import {HeroBase} from '../domain/herobase.model';
import {ConverterService} from '../services/converter.service';


export class HeroClassRarity {
    heroClass: string;
    rarity: string;

    constructor(heroClass: string, rarity: string) {
        this.heroClass = heroClass;
        this.rarity = rarity;
    }
}

@Component({
    selector: 'herobase-list',
    templateUrl: 'herobase-list.page.html'
})
export class HerobaseListPage implements OnInit {

    heroBaseList: HeroBase[] = [];
    heroClassList: HeroClassRarity[] = [];

    constructor(public enumService: EnumService,
                private backendService: BackendService,
                private toastCtrl: ToastController,
                private converter: ConverterService) {
    }

    ngOnInit(): void {
        this.backendService.getHeroBases().subscribe(data => {
            this.heroBaseList = data;
            data.forEach(hero => {
                if (!this.heroClassList.find(c => c.heroClass === hero.heroClass && c.rarity === hero.rarity)) {
                    this.heroClassList.push(new HeroClassRarity(hero.heroClass, hero.rarity));
                }
            });
        });
    }

    getHero(heroClass: HeroClassRarity, color: string): HeroBase {
        return this.heroBaseList.find(hero =>
            hero.heroClass === heroClass.heroClass && hero.rarity === heroClass.rarity && hero.color === color);
    }
}
