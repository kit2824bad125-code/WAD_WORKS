import { Request, Response } from 'express';
export declare class MessageController {
    private store;
    constructor();
    getConversations: (req: Request, res: Response) => Promise<void>;
    getMessages: (req: Request, res: Response) => Promise<void>;
    sendMessage: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=message.controller.d.ts.map