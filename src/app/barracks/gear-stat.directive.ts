import {Component, Input} from '@angular/core';

@Component({
    selector: 'gear-stat',
    template: `
        <div *ngIf="stat == 'HP_ABS'">+{{value}}<span *ngIf="showStatName"> HP</span></div>
        <div *ngIf="stat == 'HP_PERC'">+{{value}}%<span *ngIf="showStatName"> HP</span></div>
        <div *ngIf="stat == 'ARMOR_ABS'">+{{value}}<span *ngIf="showStatName"> Armor</span></div>
        <div *ngIf="stat == 'ARMOR_PERC'">+{{value}}%<span *ngIf="showStatName"> Armor</span></div>
        <div *ngIf="stat == 'STRENGTH_ABS'">+{{value}}<span *ngIf="showStatName"> Strength</span></div>
        <div *ngIf="stat == 'STRENGTH_PERC'">+{{value}}%<span *ngIf="showStatName"> Strength</span></div>
        <div *ngIf="stat == 'CRIT'">+{{value}}<span *ngIf="showStatName"> Crit chance</span></div>
        <div *ngIf="stat == 'CRIT_MULT'">+{{value}}<span *ngIf="showStatName"> Crit Multiplier</span></div>
        <div *ngIf="stat == 'INITIATIVE'">+{{value}}<span *ngIf="showStatName"> Initiative</span></div>
        <div *ngIf="stat == 'SPEED'">+{{value}}<span *ngIf="showStatName"> Speed</span></div>
        <div *ngIf="stat == 'RESISTANCE'">+{{value}}<span *ngIf="showStatName"> Resistance</span></div>
        <div *ngIf="stat == 'DEXTERITY'">+{{value}}<span *ngIf="showStatName"> Dexterity</span></div>
  `
})
export class GearStat {
    @Input() stat: string;
    @Input() value: number;
    @Input() showStatName = true;

    constructor() { }

}
