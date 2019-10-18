export class BattleStepAction {
    id: number;
    heroPosition: string;
    type: string;
    crit?: boolean;
    superCrit?: boolean;
    baseDamage?: number;
    targetArmor?: number;
    targetHealth?: number;
    armorDiff?: number;
    healthDiff?: number;
    buff?: string;
    buffIntensity?: number;
    buffDuration?: number;
    buffDurationChange?: number;
}