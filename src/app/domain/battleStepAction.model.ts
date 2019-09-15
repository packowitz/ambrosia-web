export class BattleStepAction {
    id: number;
    heroPosition: string;
    crit?: boolean;
    superCrit?: boolean;
    armorDiff?: number;
    healthDiff?: number;
    buff?: string;
    buffResisted?: boolean;
    buffIntensity?: number;
    buffDuration?: number;
    buffDurationChange?: number;
}