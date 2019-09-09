export class BattleStepAction {
    id: number;
    heroPosition: string;
    crit?: boolean;
    superCrit?: boolean;
    armorDiff?: number;
    healthDiff?: number;
    buff?: string;
    buffIntensity?: number;
    buffDuration?: number;
    buffDurationChange?: number;
}