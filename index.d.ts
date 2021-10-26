import { Stream } from 'stream';
import { ActionHandler } from 'moleculer';
import TelegramBot from 'node-telegram-bot-api';

declare module 'moleculer-telegram-bot' {   
    type telegramFileOptions = {
        fileOpts?: {
            filename?: string;
            contentType?: string;
        };
    };

    type telegramBotService = {
        name: string;
        settings: { 
            telegramToken: string;
            telegramTarget: string;
        },
        actions: {
            sendMessage: {
                params: {
                    to: string | "number";
                    message: string;
                } & TelegramBot.SendMessageOptions;
                handler: ActionHandler;
            };
    
            sendPhoto: {
                params: {
                    to: string | "number";
                    photo: string;
                } & TelegramBot.SendPhotoOptions & telegramFileOptions;
                handler: ActionHandler;
            };
    
            sendDocument: {
                params: {
                    to: string | "number";
                    doc: string;
                } & TelegramBot.SendDocumentOptions & telegramFileOptions;
                handler: ActionHandler;
            };
        },
        methods: {
            sendMessage(to: string | number, message: string, opts: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message>;
            sendPhoto(to: string | number, photo: string | Stream | Buffer, opts: TelegramBot.SendPhotoOptions, fileOpts: telegramFileOptions): Promise<TelegramBot.Message>;
            sendDocument(to: string | number, doc: string | Stream | Buffer, opts: TelegramBot.SendDocumentOptions, fileOpts: telegramFileOptions): Promise<TelegramBot.Message>;
        },
    };

    type serviceOptions = {
        target?: string;
        token?: string;
    };

    export default function(serviceOpts?: serviceOptions): telegramBotService;
}
