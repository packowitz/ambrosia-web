export class FightEnvironment {
    id: number;
    name: string;
    defaultEnvironment: boolean;
    playerHealingDec: number;
    playerHotBlocked: boolean;
    playerDotDmgInc: number;
    oppDotDmgDec: number;
    playerGreenDmgInc: number;
    playerRedDmgInc: number;
    playerBlueDmgInc: number;
    oppGreenDmgDec: number;
    oppRedDmgDec: number;
    oppBlueDmgDec: number;
    playerSpeedBarSlowed: number;
    oppSpeedBarFastened: number;
}