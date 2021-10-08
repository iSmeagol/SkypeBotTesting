import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Section from './Section';
import { Meteor } from 'meteor/meteor';
import { ValidUsers } from '../../api/users';
import Client from '../../api/classes/Client';
import User from '../../api/classes/User';
import { Contacts } from '../../api/skype';

class Main extends Component {
    constructor(props) {
        super(props);
        this.Client = new Client();
    }

    render() {
        return <Section {...this.props} Client={this.Client} />;
    }
}

Main.propTypes = {
    user: PropTypes.object,
};

export default withTracker((props) => {
    let isReady = Accounts.loginServicesConfigured(),
        user = Meteor.user();
    Meteor.subscribe(ValidUsers);
    Meteor.subscribe(Contacts);
    if (user) user = new User(user, 0);
    let users = db['#users']
        .find({}, { sort: { username_sort: 1 } })
        .fetch()
        .map((item, index) => new User(item, index));
    if (isReady && user) {
        isReady = users && users.length;
    }
    return {
        component: props.match.params.component || '',
        // title: Meteor.settings.public.config.title,
        isReady,
        user,
        users: users,
        ...props,
    };
})(Main);

// export default Main = (props) => {
//     const data = useDataReady(props);
//     useEffect(() => {
//         console.log('client loaded');
//         this.myClient = new Client(); //prevent loading class more than once
//     }, []);
//     return <Section {...data} Client={this.myClient} />;
// };

// const useDataReady = (props) =>
//     useTracker(() => {
//         let isReady = Accounts.loginServicesConfigured(),
//             user = Meteor.user();
//         Meteor.subscribe(ValidUsers);
//         if (user) user = new User(user, 0);
//         let users = db['#users']
//             .find({}, { sort: { username_sort: 1 } })
//             .fetch()
//             .map((item, index) => new User(item, index));
//         if (isReady && user) {
//             isReady = users && users.length;
//         }
//         return {
//             component: props.match.params.component || '',
//             // title: Meteor.settings.public.config.title,
//             isReady,
//             user,
//             users: users,
//             ...props,
//         };
//     });
