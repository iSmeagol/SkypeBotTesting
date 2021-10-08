// import { BotFrameworkAdapter, MessageFactory, TurnContext } from 'botbuilder';

export const Contacts = 'skype_contacts';
export const sendMessage = 'skype_message';
export const ContextCollection = new Mongo.Collection('context', { idGeneration: 'MONGO' });

if (Meteor.isServer) {
    functions[sendMessage] = async function (message, user) {
        console.log('send message small skype');
        console.log(message, user);
        return server.getSkype().sendMessage(message, user);
    };

    Meteor.publish(Contacts, () => {
        const contacts = ContextCollection.find({});
        // console.log(contacts);
        return contacts;
    });
}
