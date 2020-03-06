export class Team {
    id: number;
    type: string;
    hero1Id?: number;
    hero2Id?: number;
    hero3Id?: number;
    hero4Id?: number;

    vehicleId?: number;

    constructor(type: string) {
        this.type = type;
    }
}