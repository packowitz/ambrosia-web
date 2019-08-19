import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConverterService {

    rarityStars(rarity: string): number {
        switch (rarity) {
            case 'SIMPLE': return 1;
            case 'COMMON': return 2;
            case 'UNCOMMON': return 3;
            case 'RARE': return 4;
            case 'EPIC': return 5;
            case 'LEGENDARY': return 6;
        }
    }

    numberToArray(i: number) {
        return new Array(i);
    }

    rarityToArray(rarity: string) {
        switch (rarity) {
            case 'SIMPLE': return this.numberToArray(1);
            case 'COMMON': return this.numberToArray(2);
            case 'UNCOMMON': return this.numberToArray(3);
            case 'RARE': return this.numberToArray(4);
            case 'EPIC': return this.numberToArray(5);
            case 'LEGENDARY': return this.numberToArray(6);
        }
    }

    readableIdentifier(name: string): string {
        return name.split('_').map((str) => {
            str = str.toLowerCase();
            return str.slice(0,1).toUpperCase() + str.slice(1,str.length);
        }).join(' ');
    }
}