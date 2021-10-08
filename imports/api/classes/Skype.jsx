import { BotFrameworkAdapter } from 'botbuilder';
import { ContextCollection } from '../skype';

class Skype {
    constructor() {
        this.adapter = new BotFrameworkAdapter({
            appId: '0e5195a8-eaa4-4ef0-a453-a33802619c6d',
            appPassword: 'aQRKo!$0AXVzxLbR#&jRpXZX',
        });
    }

    async sendMessage(message, user) {
        try {
            console.log('testing', message, user);

            // const reference = TurnContext.getConversationReference(context.activity);
            // const reference = {
            //     activityId: '1633644802643',
            //     user: { id: '29:1AUgkhdoQ0GDhXIfxJmU-BqqCEfaiGHuoNkeKbt8dfiQ', name: 'Clifford McRey Benbinen' },
            //     bot: { id: '28:0e5195a8-eaa4-4ef0-a453-a33802619c6d', name: 'TMQ-Bot' },
            //     conversation: { id: '29:1AUgkhdoQ0GDhXIfxJmU-BqqCEfaiGHuoNkeKbt8dfiQ' },
            //     channelId: 'skype',
            //     locale: 'en-US',
            //     serviceUrl: 'https://smba.trafficmanager.net/apis/',
            // };
            await this.adapter.createConversation(user, async (ctx) => {
                await ctx.sendActivity(message);
            });
            return 'hihi';
        } catch (error) {
            throw new Meteor.Error('bad', error.message);
        }
    }
}

export default new Skype();
