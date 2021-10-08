import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import routes from './routes';
Meteor.settings.public.collections = {};
db = {};
Meteor.startup(() => {
    db = {
        '#users': new Mongo.Collection('#users', { idGeneration: 'MONGO' }),
    };
    for (let key in db) {
        db[key].deny({
            update() { return true; }
        });
    }
    render(routes, document.getElementById('app'));
    // console.log("settings: ", typeof Meteor.settings.public.config.title);
    console.log("settings:", Meteor.settings.public);
    if (Object.keys(Meteor.settings.public).length > 1) { //check if settings.json was loaded
        if (typeof Meteor.settings.public.config != 'undefined') { //check if public.config has value on settings.json
            document.title = Meteor.settings.public.config.title;

        }
    }
    if (Meteor.settings.public.config == void (0) || typeof Meteor.settings.public.config == 'undefined') { //checks if settings.json was loaded
        console.log('data.result.parameters.q is undefined');

    }
    console.log('data.result.parameters.q is undefined');
    // if (Meteor.settings.public.config.title) {
    // }
});