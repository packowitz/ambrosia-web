export class Story {
    id: number;
    trigger: string;
    lootBoxId?: number;
    number: number;
    title?: string;
    message: string;
    buttonText: string;
    leftPic?: string;
    rightPic?: string;

    // transient
    dirty: boolean;
}