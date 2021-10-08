import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ROLES } from '../../api/classes/Const';
import moment from 'moment-timezone';
import { ContextCollection } from '../../api/skype';

import { BotFrameworkAdapter, MessageFactory, TurnContext } from 'botbuilder';

const adapter = new BotFrameworkAdapter({
    appId: '0e5195a8-eaa4-4ef0-a453-a33802619c6d',
    appPassword: 'aQRKo!$0AXVzxLbR#&jRpXZX',
});

Meteor.startup(() => {
    if (!Meteor.users.findOne()) {
        let user = {};
        user.username = 'root';
        user.email = 'root@root.com';
        // user.emails = [{ address: 'tmq.hrapp@gmail.com', verified: true }];
        user.profile = {
            username_sort: user.username.toLowerCase(),
            first: 'Root',
            last: 'User',
            role: ROLES.SUPERUSER,
            retired: 0,
            createdAt: moment().valueOf(),
        };
        user.password = 'root';
        Accounts.createUser(user);
        Meteor.users.update({ username: user.username }, { $set: { 'emails.0.verified': true } });
    }

    Picker.route('/api/messages', (params, req, res) => {
        // ContextCollection.insert({ req: req, res: res });
        let statusCode = {
            status: (status) => {
                res.writeHead(status);
            },
            end: (end) => {
                res.end(end);
            },
        };
        console.log(req.method, 'req Method');

        adapter.processActivity(req, statusCode, async (context) => {
            try {
                // ContextCollection.insert({
                //     sendActivity: context.sendActivity.toString(),
                //     sendActivities: context.sendActivities.toString(),
                // });
                // console.log(context.activity);
                // const welcomeText = 'Papogi?';
                // console.log('send activity ', context.getConversationReference());
                // console.log(ContextCollection.find({ 'context.user.id': context.activity.from.id }).fetch());
                console.log(context.activity, 'this is reference');
                // if (context.action !== 'add' || ContextCollection.find({ 'context.user.id': context.from.id })) return;

                const reference = TurnContext.getConversationReference(context.activity);
                ContextCollection.insert({ context: reference });
                await context.sendActivity('Welcome to TMQ');
                console.log('saved to DB');
            } catch (error) {
                console.error(error);
            }
            // Route to main dialog.
            // await myBot.run(context);
        });
    });
});
