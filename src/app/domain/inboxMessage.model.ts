import {InboxMessageItem} from "./inboxMessageItem.model";

export class InboxMessage {
    id: number;
    playerId: number;
    messageType: string;
    senderId?: number;
    read: boolean;
    message: string;
    items: InboxMessageItem[];
    ageInSeconds: number;
    validInSeconds: number;
}