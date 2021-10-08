import { Accounts } from 'meteor/accounts-base';
import { UsersRegister, UpdateUserLogin, UpdateUserRole, UsersResetLink, UserChangePassword } from '../users';
import { sendMessage } from '../skype';

export default class Client {
    constructor() {
        this.Auth = new Auth();
        this.Skype = new Skype();
    }
}

class Auth {
    constructor() {}
    accountLogin(email, password, callback) {
        Meteor.loginWithPassword(email, password, (err) => {
            callback(err);
            if (!err) {
                Meteor.call(UpdateUserLogin);
            }
        });
    }
    accountRegister(data, callback) {
        // console.log(data);
        Meteor.call(UsersRegister, data, (err, data) => {
            callback(err, data);
        });
    }

    accountUpdateRole(userName, role, callback) {
        Meteor.call(UpdateUserRole, userName, role, (err, data) => {
            callback(err, data);
        });
    }
    accountSendResetLink(data, callback) {
        Meteor.call(UsersResetLink, data, (err) => {
            callback(err);
        });
    }

    accountResetPassword(data, callback) {
        Accounts.resetPassword(data.url, data.password, (err) => {
            callback(err);
        });
    }

    accountLogout(callback) {
        Meteor.logout((err) => {
            callback(err);
        });
    }

    accountChangePassword(currentPassword, newPassword, callback) {
        Meteor.call(UserChangePassword, currentPassword, newPassword, (err, data) => {
            callback(err, data);
        });
    }
}

class Skype {
    sendMessage(message, user, callback) {
        Meteor.call(sendMessage, message, user, (err, data) => {
            callback(err, data);
        });
    }
}
