import { Accounts } from 'meteor/accounts-base';
// import { MessagesAddSender } from '../messages';
// import SettingManager from './SettingManager';
import Future from 'fibers/future';
import Fiber from 'fibers';
// import nodemailer from 'nodemailer';
import clamscan from 'clamscan';
import fs from 'fs';
import ics from 'ics';
import later from 'later';

import Skype from './Skype';

export default class Server {
    constructor() {}

    createFuture() {
        return new Future();
    }

    getICS() {
        return ics;
    }

    getFiber(data) {
        return Fiber(data);
    }

    getFileSystem() {
        return fs;
    }

    later() {
        return later;
    }

    // getNodemailer() {
    //     return nodemailer;
    // }

    getClamscan(options) {
        return clamscan(options);
    }

    getSkype() {
        return Skype;
    }

    run() {
        console.log('Initializing server setup....');
        let appVersion = 'MeteorJS + ReactJS';
        console.log(`Version: ${appVersion}`);
        console.log(`Meteor Version: ${Meteor.release}`);
        later.date.localTime();
        Accounts.validateLoginAttempt((data) => {
            if (data.error) return data.error;
            // if (!data.user.emails[0].verified)
            //     throw new Meteor.Error('BAD', 'Verify email account first!');
            if (data.user.emails[0].verified && data.user.profile.role === 0)
                throw new Meteor.Error('BAD', 'Account must be accepted by an admin!');
            if (data.user.profile && data.user.profile.retired) throw new Meteor.Error('BAD', 'User account disabled!');
            else return true;
        });
    }
}
