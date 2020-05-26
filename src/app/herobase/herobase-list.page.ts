import {Component, OnInit} from '@angular/core';
import {EnumService} from '../services/enum.service';
import {BackendService} from '../services/backend.service';
import {ToastController} from '@ionic/angular';
import {HeroBase} from '../domain/herobase.model';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';


export class HeroClassRarity {

    heroClass: string;
    rarity: string;
    stars: number;

    constructor(heroClass: string, rarity: string, stars: number) {
        this.heroClass = heroClass;
        this.rarity = rarity;
        this.stars = stars;
    }
}

@Component({
    selector: 'herobase-list',
    templateUrl: 'herobase-list.page.html'
})
export class HerobaseListPage {

    saving = false;

    heroClassList: HeroClassRarity[] = [];

    sorting = 'RarityDesc';
    onlyCloneable = false;
    onlyStartingHeroes = false;
    showSimpleHeroes = true;
    showCommonHeroes = true;
    showUncommonHeroes = true;
    showRareHeroes = true;
    showEpicHeroes = true;

    constructor(public enumService: EnumService,
                private backendService: BackendService,
                private toastCtrl: ToastController,
                private converter: ConverterService,
                private model: Model,
                private router: Router) {
    }

    ionViewWillEnter(): void {

        if (!this.model.baseHeroes) {
            this.backendService.getHeroBases().subscribe(data => {
                this.model.baseHeroes = data;
                this.setHeroList();
            });
        } else {
            this.setHeroList();
        }
    }

    showStats() {
        this.router.navigateByUrl('/herobase/stats');
    }

    setHeroList() {
        let classList = [];
        this.model.baseHeroes.filter(h => {
            if (this.onlyCloneable && !h.recruitable) { return false; }
            if (this.onlyStartingHeroes && !h.startingHero) { return false; }
            if (!this.showSimpleHeroes && h.rarity === 'SIMPLE') { return false; }
            if (!this.showCommonHeroes && h.rarity === 'COMMON') { return false; }
            if (!this.showUncommonHeroes && h.rarity === 'UNCOMMON') { return false; }
            if (!this.showRareHeroes && h.rarity === 'RARE') { return false; }
            if (!this.showEpicHeroes && h.rarity === 'EPIC') { return false; }
            return true;
        }).forEach(hero => {
            if (!classList.find(c => c.heroClass === hero.heroClass && c.rarity === hero.rarity)) {
                classList.push(new HeroClassRarity(hero.heroClass, hero.rarity, this.converter.rarityStars(hero.rarity)));
            }
        });
        this.sort(classList);
    }

    sort(classList: HeroClassRarity[]) {
        if (this.sorting === 'RarityAsc') {
            this.heroClassList = classList.sort((a: HeroClassRarity, b: HeroClassRarity) => a.stars === b.stars ? a.heroClass < b.heroClass ? -1 : 1 : a.stars - b.stars);
        }
        if (this.sorting === 'RarityDesc') {
            this.heroClassList = classList.sort((a: HeroClassRarity, b: HeroClassRarity) => a.stars === b.stars ? a.heroClass < b.heroClass ? -1 : 1 : b.stars - a.stars);
        }
        if (this.sorting === 'NameAsc') {
            this.heroClassList = classList.sort((a: HeroClassRarity, b: HeroClassRarity) => a.heroClass === b.heroClass ? b.stars - a.stars : a.heroClass < b.heroClass ? -1 : 1);
        }
        if (this.sorting === 'NameDesc') {
            this.heroClassList = classList.sort((a: HeroClassRarity, b: HeroClassRarity) => a.heroClass === b.heroClass ? b.stars - a.stars : a.heroClass < b.heroClass ? 1 : -1);
        }
    }

    getHero(heroClass: HeroClassRarity, color: string): HeroBase {
        return this.model.baseHeroes.find(hero =>
            hero.heroClass === heroClass.heroClass && hero.rarity === heroClass.rarity && hero.color === color);
    }

    gotoHero(hero: HeroBase) {
        this.router.navigateByUrl('/herobase/edit/' + hero.id);
    }

    newBaseHero() {
        this.router.navigateByUrl('/herobase/create');
    }

    createHero(heroClass: HeroClassRarity, color: string) {
        let copyFrom = this.model.baseHeroes.find(h => h.heroClass === heroClass.heroClass && h.rarity === heroClass.rarity);
        let newHero = new HeroBase(copyFrom, color);
        this.backendService.createHeroBase(newHero).subscribe(hero => {
            this.model.updateBaseHero(hero);
            this.router.navigateByUrl('/herobase/edit/' + hero.id);
        }, () => this.saving = false);
    }
}
