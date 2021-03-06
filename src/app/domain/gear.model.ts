export class Gear {
    id: number;
    playerId: number;
    equippedTo?: number;
    modificationInProgress: boolean;
    modificationPerformed: boolean;
    modificationAllowed: string;
    set: string;
    rarity: string;
    type: string;
    stat: string;
    statValue: number;
    statQuality: number;
    gearQuality: string;
    jewelSlot1?: string;
    jewel1Type?: string;
    jewel1Level?: number;
    jewelSlot2?: string;
    jewel2Type?: string;
    jewel2Level?: number;
    jewelSlot3?: string;
    jewel3Type?: string;
    jewel3Level?: number;
    jewelSlot4?: string;
    jewel4Type?: string;
    jewel4Level?: number;
    specialJewelSlot: boolean;
    specialJewelType?: string;
    specialJewelLevel?: number;

    // transient
    markedToBreakdown: boolean;
}