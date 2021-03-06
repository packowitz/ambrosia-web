export class BattleStepAction {
    id: number;
    heroPosition: string;
    heroName: string;
    type: string;
    crit?: boolean;
    superCrit?: boolean;
    baseDamage?: number;
    baseDamageText?: string;
    targetArmor?: number;
    targetHealth?: number;
    armorDiff?: number;
    healthDiff?: number;
    shieldAbsorb?: number;
    buff?: string;
    buffIntensity?: number;
    buffDuration?: number;
    buffDurationChange?: number;
    speedbarFill?: number;
}