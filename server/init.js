functions = {};
console.log('initjs called');
if (Meteor.settings.config && Meteor.settings.config.email && Meteor.settings.config.email.smtp) {
    process.env.MAIL_URL =
        'smtp://' +
        encodeURIComponent(Meteor.settings.config.email.smtp.username) +
        ':' +
        encodeURIComponent(Meteor.settings.config.email.smtp.password) +
        '@' +
        Meteor.settings.config.email.smtp.host +
        ':' +
        Meteor.settings.config.email.smtp.port;
}
