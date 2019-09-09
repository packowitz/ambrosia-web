import {Component, Input} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';
import {BattleHero} from '../domain/battleHero.model';
import {Battle} from '../domain/battle.model';

@Component({
    selector: 'battlefield-hero',
    template: `
        <div class="container flex-vert" *ngIf="hero" [class.container-active]="hero && battle.activeHero == hero.position">
            <div class="flex-start mt-1">
                <div class="ml-1 level-bubble background-{{hero.color}}">{{hero.level}}</div>
                <div class="flex-grow">
                    <div class="ml-1 mr-1 health-bar">
                        <span class="health-bar-inner" [style.width]="(100 * hero.currentHp / hero.heroHp) + '%'"></span>
                    </div>
                    <div class="ml-1 mr-1 armor-bar">
                        <span class="armor-bar-inner" [style.width]="(100 * hero.currentArmor / hero.heroArmor) + '%'"></span>
                    </div>
                    <div class="ml-1 mr-1">
                        <div class="speedbar" [style.width]="hero.currentSpeedBar > 10000 ? '100%' : (hero.currentSpeedBar / 100) + '%'"></div>
                    </div>
                </div>
            </div>
            <div class="flex-grow"></div>
            <div class="flex-center {{hero.color}}">{{hero.heroBase.name}}</div>
            <div class="flex-center mb-1"><ion-icon name="star" *ngFor="let star of converter.numberToArray(hero.stars)"></ion-icon></div>
        </div>
        <div class="container container-empty" *ngIf="!hero"></div>
  `,
    styleUrls: ['battlefieldHero.directive.scss']
})
export class BattlefieldHero {
    @Input() battle: Battle;
    @Input() hero: BattleHero;

    constructor(private converter: ConverterService) { }

}