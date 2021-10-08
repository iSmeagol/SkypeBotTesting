import React, { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import PropTypes from 'prop-types';

// meteor
import { Accounts } from 'meteor/accounts-base';
import { ROUTES } from '../../../../api/classes/Const';
import { withTracker } from 'meteor/react-meteor-data';

// antd icons
import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

// antd
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Space from 'antd/lib/space';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';

const { Item } = Form;
const { Title } = Typography;

const Login = ({ history, location, Client }) => {
    const [loginProcess, setLoginProcess] = useState({
        status: '',
        sending: false,
        processing: false,
    });

    const [form] = Form.useForm();

    useEffect(() => {
        const match = matchPath(location.pathname, {
            path: '/:component/:data',
            exact: false,
            strict: false,
        });
        if (!match) return;

        Accounts.verifyEmail(match.params.data, (error) => {
            if (error) return setLoginProcess({ status: error.reason });

            setLoginProcess({ status: 'Email verified. Your account must be approved by an admin.' });
        });
    }, [location]);

    const onFormFinish = () => {
        const { email, password } = form.getFieldValue();
        if (loginProcess.processing) return;
        setLoginProcess({ processing: true });
        Client.Auth.accountLogin(email, password, (err) => {
            if (!err) return history.replace(ROUTES.DASHBOARD);
            console.log(err);
            if (err.reason === 'Verify email account first!') setLoginProcess({ status: err.reason });
            Bert.alert(err.reason, 'danger', 'growl-top-right');
            setLoginProcess({ processing: false });
        });
        resetStatus();
    };

    const sendLink = () => {
        setLoginProcess({ sending: true });

        Client.Auth.sendVerificationLink({ email: form.getFieldValue().email }, (err) => {
            if (err) return Bert.alert(err.reason, 'danger', 'growl-top-right');

            setLoginProcess({ status: 'Verification link sent!' });
            setLoginProcess({ sending: false });
        });
    };

    const resetStatus = () => setLoginProcess({ status: '' });

    const redirectPass = () => history.replace(`../${ROUTES.FORGOT_PASSWORD}`);

    // const redirectRegister = () => history.replace(`../${ROUTES.REGISTER}`);
    const redirectRegister = () =>
        Client.Skype.sendMessage((err, data) => {
            console.log(data, 'data');
        });

    const commonRules = (inputName) => {
        return { required: true, message: `Please input your ${inputName}!`, whitespace: true };
    };

    return (
        <Card className="login">
            <Space className="login-container" align="center" direction="vertical">
                <Title level={1} children="Client-Agent App" />

                {/* {loginProcess.status !== '' && (
                    <div className="alert alert-warning" role="alert">
                        {loginProcess.sending ? (
                            <Spin spinning={!!loginProcess.sending} tip=" Sending Link..." />
                        ) : (
                            <Button type="text" onClick={sendLink} children="Send Verification Link" />
                        )}
                    </div>
                )} */}

                <Form className="login-form" form={form} onFinish={onFormFinish}>
                    <Item name="email" rules={[{ ...commonRules('email') }]}>
                        <Input prefix={<UserOutlined />} type="email" placeholder="Email" allowClear />
                    </Item>
                    <Item name="password" rules={[{ ...commonRules('password') }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Item>

                    <Item style={{ textAlign: 'center', marginTop: '.5rem' }}>
                        <Button type="primary" htmlType="submit" children="Log in" loading={loginProcess.processing} />
                    </Item>
                </Form>

                <Button type="text" onClick={redirectRegister} children="Need an account?" />
                <Button type="text" onClick={redirectPass} children="  Forgot Password?" />
            </Space>
        </Card>
    );
};

Login.propTypes = {
    location: PropTypes.object,
    Client: PropTypes.object,
    history: PropTypes.object,
    title: PropTypes.string,
};

export default withTracker(() => {
    return {};
})(Login);
