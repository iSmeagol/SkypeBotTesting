import React, { useCallback, useEffect, useState } from 'react';

// meteor
import { ROUTES } from '../../../../api/classes/Const';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

// antd
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Space from 'antd/lib/space';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Divider from 'antd/lib/divider';

import { PasswordInput } from 'antd-password-input-strength';

import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import TwitterOutlined from '@ant-design/icons/TwitterOutlined';
import FacebookOutlined from '@ant-design/icons/FacebookOutlined';
import GoogleOutlined from '@ant-design/icons/GoogleOutlined';

const { Item } = Form;
const { Title, Text, Paragraph } = Typography;

const Register = ({ Client, history }) => {
    const [registerProcess, setRegisterProcess] = useState(false);

    const [isContainsUpper, setIsContainsUpper] = useState(false);
    const [isContainsLower, setIsContainsLower] = useState(false);
    const [isContainsSpecial, setIsContainsSpecial] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form] = Form.useForm();

    const reset = () => {
        form.resetFields();

        setRegisterProcess(false);
    };

    const onFormFinish = () => {
        if (registerProcess) return;

        const { username, firstname: first, lastname: last, email, password } = form.getFieldValue();

        setRegisterProcess(true);

        Client.Auth.accountRegister({ username, first, last, email, password, number: '' }, (err) => {
            if (err) return Bert.alert(err.reason, 'danger', 'growl-top-right');

            Bert.alert('New user registered! Redirecting to login page...', 'success', 'growl-top-right');

            setTimeout(() => {
                reset();
                history.replace(ROUTES.LOGIN);
            }, 3000);
        });
    };

    const redirect = () => history.replace(ROUTES.LOGIN);

    const commonRules = (inputName = '', message = 'Please input your') => {
        return { required: true, message: `${message} ${inputName}`, whitespace: true };
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
    };

    const passwordValidation = ({ getFieldValue }) => {
        return {
            validator(_, value) {
                const upper = /(?=.*?[A-Z])/g;
                const lower = /(?=.*?[a-z])/g;
                const special = /(?=.*?[#?!@$%^&*-/.])/g;

                let error = '';

                const isContainsUpper = upper.test(value);
                const isContainsLower = lower.test(value);
                const isContainsSpecial = special.test(value);

                if (upper.test(value)) setIsContainsUpper(isContainsUpper);
                else {
                    setIsContainsUpper(false);
                    error = 'Must have at least one uppercase letter.';
                }

                if (lower.test(value)) setIsContainsLower(isContainsLower);
                else {
                    setIsContainsLower(false);
                    error = 'Must have at least one lowercase letter.';
                }

                if (special.test(value)) setIsContainsSpecial(isContainsSpecial);
                else {
                    setIsContainsSpecial(false);
                    error = 'Must have at least one special character.';
                }

                if (isContainsUpper && isContainsLower && isContainsSpecial) return Promise.resolve();

                if (!getFieldValue('password')) {
                    setIsContainsUpper(false);
                    setIsContainsLower(false);
                    setIsContainsSpecial(false);
                }

                return Promise.reject(new Error(error));
            },
        };
    };
    const onEyeClick = () => setShowPassword(!showPassword);

    const showPasswordEyeLogic = useCallback(() => {
        const inputPassword = document.querySelector('.ant-input-password input');

        if (!inputPassword) return;

        if (showPassword) return inputPassword.setAttribute('type', 'text');

        inputPassword.setAttribute('type', 'password');
    }, [showPassword]);

    useEffect(() => {
        showPasswordEyeLogic();

        return () => showPasswordEyeLogic();
    }, [showPasswordEyeLogic]);

    const PasswordConstraints = () => {
        return (
            <Space className="password-constraint" direction="horizontal" wrap>
                <ul>
                    <li>
                        <Text type={`${isContainsUpper ? 'success' : 'secondary'}`}>One uppercase letter</Text>
                    </li>
                    <li>
                        <Text type={`${isContainsLower ? 'success' : 'secondary'}`}>One lowercase letter</Text>
                    </li>
                    <li>
                        <Text type={`${isContainsSpecial ? 'success' : 'secondary'}`}>One special character</Text>
                    </li>
                </ul>
            </Space>
        );
    };

    return (
        <Card className="register">
            <Space className="register-container" direction="vertical" align="center" style={{ textAlign: 'center' }}>
                <Title level={1} children="Sign Up" />
                <Space className="register__3rdparty" align="center" style={{ width: '100%' }} direction="vertical">
                    <Button
                        children={<Text type="secondary" children="Facebook" />}
                        icon={<FacebookOutlined style={{ fontSize: '160%' }} />}
                    />
                    <Button
                        children={<Text type="secondary" children="Google" />}
                        icon={<GoogleOutlined style={{ fontSize: '160%' }} />}
                    />
                    <Button
                        children={<Text type="secondary" children="Twitter" />}
                        icon={<TwitterOutlined style={{ fontSize: '160%' }} />}
                    />
                </Space>
                <Divider plain>
                    <strong>or</strong>
                </Divider>

                <Form {...formItemLayout} className="register-form" form={form} onFinish={onFormFinish}>
                    <Item className="float-label" name="firstname" rules={[{ ...commonRules('first name') }]}>
                        <Input type="text" suffix={<label className="label">First Name</label>} required allowClear />
                    </Item>

                    <Item className="float-label" name="lastname" rules={[{ ...commonRules('last name') }]}>
                        <Input type="text" suffix={<label className="label">Last Name</label>} required allowClear />
                    </Item>
                    <Item
                        className="float-label"
                        name="email"
                        rules={[
                            { ...commonRules('email') },
                            {
                                type: 'email',
                                message: 'Invalid Email',
                            },
                        ]}
                    >
                        <Input type="email" suffix={<label className="label">Email</label>} required allowClear />
                    </Item>
                    <Item
                        className="float-label"
                        name="password"
                        rules={[{ ...commonRules('password!') }, (data) => passwordValidation(data)]}
                        help={<PasswordConstraints />}
                    >
                        <PasswordInput
                            iconRender={() => {
                                return (
                                    <>
                                        <label className="label">Password</label>
                                        {showPassword ? (
                                            <EyeOutlined onClick={onEyeClick} style={{ marginLeft: '4px' }} />
                                        ) : (
                                            <EyeInvisibleOutlined onClick={onEyeClick} style={{ marginLeft: '4px' }} />
                                        )}
                                    </>
                                );
                            }}
                            required
                        />
                    </Item>
                    <Item style={{ textAlign: 'center', justifyContent: 'center', marginTop: '.5rem' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            children="Register"
                            loading={registerProcess.processing}
                        />
                    </Item>
                </Form>
                <Paragraph type="secondary">
                    By signing up, you agree to our <strong>Terms</strong>, <strong>Data Policy</strong> and
                    <strong>Cookies Policy</strong>.
                </Paragraph>
                <Button type="text" onClick={redirect}>
                    <Text strong> Already Have an account?</Text>
                </Button>
            </Space>
        </Card>
    );
};

Register.propTypes = {
    Client: PropTypes.object,
    history: PropTypes.object,
    title: PropTypes.object,
};

export default withTracker(() => {
    return {};
})(Register);
