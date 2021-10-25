import { ActionHandler } from 'moleculer';
import TelegramBot from 'node-telegram-bot-api';

declare module 'moleculer-telegram-bot' {
    type telegramBotService = {
        name: string;
        settings: { telegramToken: string },
        actions: {
            sendMessage: {
                params: {
                    to: string|"number";
                    message: string;
                    parse_mode?: TelegramBot.ParseMode;
                    disable_web_page_preview?: boolean;
                    disable_notification?: boolean;
                    reply_to_message_id?: "number";
                    reply_markup?: any;
                };
                handler: ActionHandler;
            };
    
            sendPhoto: {
                params: {
                    to: string|"number";
                    photo: string;
                    parse_mode?: TelegramBot.ParseMode;
                    caption?: string;
                    disable_notification?: boolean;
                    reply_to_message_id?: "number";
                    reply_markup?: any;
                    fileOpts?: {
                        filename?: string;
                        contentType?: string;
                    };
                };
                handler: ActionHandler;
            };
    
            sendDocument: {
                params: {
                    to: string|"number";
                    doc: string;
                    parse_mode?: TelegramBot.ParseMode;
                    caption?: string;
                    disable_notification?: boolean;
                    reply_to_message_id?: "number";
                    reply_markup?: any;
                    fileOpts?: {
                        filename?: string;
                        contentType?: string;
                    };
                };
                handler: ActionHandler;
            };
        },
        methods: {
            sendMessage(to: string|number, message: string, opts: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message>;
            sendPhoto(to: string|number, photo: string, opts: TelegramBot.SendPhotoOptions, fileOpts: telegramBotService["actions"]["sendPhoto"]["params"]["fileOpts"]): Promise<TelegramBot.Message>;
            sendDocument(to: string|number, doc: string, opts: TelegramBot.SendPhotoOptions, fileOpts: telegramBotService["actions"]["sendDocument"]["params"]["fileOpts"]): Promise<TelegramBot.Message>;
        },
    };

    export default function(): telegramBotService;
}
