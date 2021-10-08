import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { ROUTES, isPermitted, ROLES } from '../../api/classes/Const';

// antd css
import 'antd/dist/antd.css';

import NotFound from './NotFound';

import Login from './auth/login/Login';
import Register from './auth/register/Register';

import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';

import Loader from './extras/Loader';
import HomeDashboard from './user/HomeDashboard';

class Section extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let component = this.props.component || '';
        let continueRender = true;

        if (this.props.isReady) {
            //if tasktracker data is ready
            switch (
                component //rerouting will be here if user is/not logged in
            ) {
                case ROUTES.LOGIN:
                case ROUTES.REGISTER:
                case ROUTES.FORGOT_PASSWORD:
                case ROUTES.RESET_PASSWORD:
                case ROUTES.VERIFY:
                    if (this.props.user)
                        //if on route verify, check if user is logged in
                        this.props.history.replace('/');
                    break;
                case ROUTES.MAIN:
            }

            if (continueRender)
                switch (
                    component //permissions
                ) {
                    case ROUTES.MAIN:
                        const userRole = this.props.user ? this.props.user.role : 'none';
                        if (!isPermitted(userRole, ROLES.VIEW_DASHBOARD)) continueRender = false;
                        break;
                }

            if (continueRender)
                switch (
                    component //rendering the component
                ) {
                    case ROUTES.LOGIN:
                    case ROUTES.VERIFY:
                        return <Login key={component} {...this.props} />;
                    case ROUTES.REGISTER:
                        return <Register key={component} {...this.props} />;
                    case ROUTES.FORGOT_PASSWORD:
                        return <ForgotPassword key={component} {...this.props} />;
                    case ROUTES.RESET_PASSWORD:
                        return <ResetPassword key={component} {...this.props} />;
                    case ROUTES.MAIN:
                        return <HomeDashboard key={component} {...this.props} />;
                    default:
                        return <NotFound type="RouteNotFound" key={component} {...this.props} />;
                }
            else this.props.history.replace(ROUTES.LOGIN);
        }
        return (
            <div className="container">
                <div className="col-md-4 offset-md-4 text-center mt-4">
                    <Loader visible={true} large={true}>
                        {this.props.title}
                    </Loader>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    return {};
})(Section);
