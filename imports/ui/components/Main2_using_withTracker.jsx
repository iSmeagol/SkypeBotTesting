import React, { Component, useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";

import Section from "./Section";
import { Meteor } from "meteor/meteor";
import { ValidUsers } from '../../api/users';
import Client from "../../api/classes/Client";
import User from '../../api/classes/User';
import PropTypes from 'prop-types';

const Main = (props) => {
    useEffect(() => {
        this.myClient = new Client(); //prevent loading class more than once
    }, [])
    return (
        <Section {...props} Client={this.myClient} />
    );
};

const withData = withTracker((props) => {
    let isReady = Accounts.loginServicesConfigured(),
        user = Meteor.user();
    Meteor.subscribe(ValidUsers);
    if (user)
        user = new User(user, 0);
    let users = db['#users'].find({}, { sort: { username_sort: 1 } }).fetch().map((item, index) => new User(item, index));
    if (isReady && user) {
        isReady = users && users.length
    }
    return {
        component: props.match.params.component || '',
        isReady,
        user,
        users: users,
    };
});


export default withData(Main);