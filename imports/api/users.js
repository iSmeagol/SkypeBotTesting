import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ROLES, isPermitted, RETIRED, VERIFIED, VALUE } from './classes/Const';
import { check } from 'meteor/check';
import Util from './classes/Utilities';
import moment from 'moment-timezone';

export const ValidUsers = 'users_valid';
export const UsersRegister = 'users_register';
export const UsersResetLink = 'users_resetLink';
export const UpdateUserRole = 'update_user_role';
export const UpdateUserLogin = 'update_user_login';
export const UserChangePassword = 'users_changepassword';

if (Meteor.isServer) {
    functions[UserChangePassword] = async function (currentPassword, newPassword) {
        try {
            //check password for the logged user
            let result = Accounts._checkPassword(Meteor.user(), currentPassword);
            if (result.error) {
                return result;
            }

            //change password
            let result2 = Accounts.setPassword(this.userId, newPassword, { logout: false });
            console.log({ result2 });
            return { status: 'success', action: 'set-password' };
        } catch (err) {
            console.error(err);
            throw new Meteor.Error('bad', err.message);
        }
    };

    functions[UsersRegister] = function (data) {
        try {
            check(data, Object);
            check(data.email, String);
            check(data.password, String);
            // check(data.username, String);
            check(data.first, String);
            check(data.last, String);
            check(data.number, String);
            console.log(data);

            let user = {};

            // user.username = data.username;

            user.emails = [{ address: data.email, verified: VERIFIED.FALSE }];
            user.email = data.email;
            user.profile = {
                username_sort: data.email.toLowerCase(),
                first: data.first,
                last: data.last,
                number: data.number,
                role: ROLES.USER,
                type: 'client',
                retired: RETIRED.FALSE,
            };
            user.password = data.password;
            Accounts.createUser(user);
            // Meteor.users.update({ email: user.email }, { $set: { 'emails.0.verified': true } });
        } catch (err) {
            throw new Meteor.Error('bad', err.message);
        }
    };

    functions[UsersResetLink] = function (data) {
        try {
            check(data, Object);
            check(data.email, String);
            let user = Accounts.findUserByEmail(data.email),
                emailInfo = Meteor.settings.config.email,
                myFuture = server.createFuture();
            console.log({ emailInfo });
            if (typeof user !== 'undefined') {
                Accounts.emailTemplates.from = emailInfo.info.from;
                Accounts.emailTemplates.siteName = emailInfo.info.siteName;
                Accounts.emailTemplates.resetPassword.subject = function () {
                    return `[${Meteor.settings.public.config.title}] Reset Password Link`;
                };
                Accounts.emailTemplates.resetPassword.text = Accounts.emailTemplates.resetPassword.html = function (
                    userObj,
                    url
                ) {
                    return (
                        `Reset Password link for [${Meteor.settings.public.config.title}]: ` +
                        url.replace('/#/reset-password', '/reset')
                    );
                };
                Accounts.sendResetPasswordEmail(user._id, data.email);
                myFuture.return('Reset Link is sent.');
            } else throw new Meteor.Error(400, "Email doesn't exist");
            return myFuture.wait();
        } catch (err) {
            console.error(err);
            throw new Meteor.Error('bad', err.message);
        }
    };

    functions[UpdateUserRole] = function (userName, role) {
        try {
            console.log('user register');
            check(userName, String);
            check(role, Number);
            Meteor.users.update({ username: userName }, { $set: { 'profile.role': role } });
        } catch (err) {
            console.error(err);
            throw new Meteor.Error(UpdateUserRole, err.message);
        }
    };

    functions[UpdateUserLogin] = function () {
        try {
            check(this.userId, String);
            return Meteor.users.update(this.userId, { $set: { lastLoggedInDt: new Date() } });
        } catch (err) {
            console.error(err);
            throw new Meteor.Error('bad', err.message);
        }
    };

    Meteor.publish(ValidUsers, function () {
        try {
            let cursor = Meteor.users.find(
                { 'profile.retired': VALUE.FALSE, 'emails.0.verified': true },
                { sort: { username_sort: 1 } }
            );
            Util.setupHandler(this, '#users', cursor, (doc) => {
                let newDoc = doc;
                if (newDoc.profile.emails)
                    newDoc.profile.emails.forEach((email) => {
                        email.password = '------';
                    });
                if (doc.services) delete doc.services;
                if (doc.emails && doc.emails[0].address) newDoc.email = doc.emails[0].address;
                if (doc.createdAt) doc.dateJoined = moment(doc.createdAt).format('MMMM DD, YYYY hh:mm:ss A');
                if (doc.lastLoggedInDt)
                    doc.lastLoggedInDt = moment(doc.lastLoggedInDt).format('MMMM DD, YYYY hh:mm:ss A');
                return newDoc;
            });
        } catch (err) {
            console.error(err);
            throw new Meteor.Error('bad', err.message);
        }
    });
}
