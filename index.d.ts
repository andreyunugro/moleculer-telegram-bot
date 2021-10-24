import TelegramBot from 'node-telegram-bot-api';

declare module 'moleculer-telegram' {
    export const actions: {
        sendMessage: {
            params: {
                to: string|number;
				message: string;
                parse_mode?: TelegramBot.ParseMode;
				disable_web_page_preview?: boolean;
				disable_notification?: boolean;
				reply_to_message_id?: number;
				reply_markup?: any;
            };
            handler: any;
        };

        sendPhoto: {
            params: {
                to: string|number;
				photo: string;
                parse_mode?: TelegramBot.ParseMode;
                caption?: string;
				disable_notification?: boolean;
				reply_to_message_id?: number;
				reply_markup?: any;
                fileOpts?: {
                    filename?: string;
                    contentType?: string;
                };
            };
            handler: any;
        };

        sendDocument: {
            params: {
                to: string|number;
				doc: string;
                parse_mode?: TelegramBot.ParseMode;
                caption?: string;
				disable_notification?: boolean;
				reply_to_message_id?: number;
				reply_markup?: any;
                fileOpts?: {
                    filename?: string;
                    contentType?: string;
                };
            };
            handler: any;
        };
    };

    export const methods: {
        sendMessage(to: string|number, message: string, opts: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message>;
        sendPhoto(to: string|number, photo: string, opts: TelegramBot.SendPhotoOptions, fileOpts: TelegramBot.fileOpts): Promise<TelegramBot.Message>;
        sendDocument(to: string|number, doc: string, opts: TelegramBot.SendPhotoOptions, fileOpts: TelegramBot.fileOpts): Promise<TelegramBot.Message>;
    };

    export const name: string;

    export const settings: {
        telegramToken: string;
    };
}
