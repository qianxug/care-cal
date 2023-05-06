import React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Card, Checkbox, Alert, Space } from 'antd';
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };

export default function RegisterPage() {
    const navigate = useNavigate()
    const { signup, currentUser } = useAuth()
    const [loading, setLoading] = useState('')
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const submitHandler = async (values) => {
        console.log('Finish:', values);
        console.log(values.name)

        try {
            setAlertMessage('')
            setLoading(true)
            await signup(values.email, values.password)
            console.log("made user")
            setAlertMessage(`Account Created. Redirecting you to the login page.`)
            setAlertType('success')
          

            const url = 'http://localhost:8000/api/register';
            const data = {
                UID: currentUser.uid,
                Care: values.care,
                Name: values.name,
                Email: values.email,
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                // Handle the response data
                console.log(result);
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });

            setTimeout(() => {
                navigate('/login')
            }, 3000)
            
            
        }
        catch {
            setAlertMessage('Failed to create user')
            setAlertType('error')
            console.log("failed")
        }
        setLoading(false)
      };

    return (
        <>
            <div style={{ backgroundColor: '#f2f2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card title="Create an Account" bordered={true} style={{ width: 500 }}>
                {alertMessage && (
                    <Alert
                    message={currentUser && currentUser.email}
                    type={alertType}
                    style = {{margin: 15}}
                    showIcon
                    closable
                    onClose={() => {
                        setAlertMessage('');
                        setAlertType('');
                    }}
                    />
                )}
                    <Form
                        {...formItemLayout}
                        onFinish = {submitHandler}
                    >
                        <Form.Item
                            name = "name"
                            label = "Full Name"
                            hasFeedback
                            rules = {[
                                {
                                    required: true,
                                    message: "Please enter your name"
                                }

                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name = "email"
                            label = "E-mail"
                            rules = {[
                                {
                                    type: 'email',
                                    message: 'The input is not a valid E-mail'
                                },
                                {
                                    required: true,
                                    message: "Please input a valid E-mail"
                                }

                            ]}
                            hasFeedback
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    min: 6,
                                    message: 'Password must be at least 6 characters long',
                                },
                                {
                                    max: 20,
                                    message: 'Password cannot exceed 20 characters',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirm password"
                            label="Confirm Password"
                            hasFeedback
                            rules={[
                            {
                                required: true,
                                message: 'Please re-enter your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>   
                        <Form.Item 
                            name="care"
                            valuePropName="checked"
                            style = {{marginBottom: 0}}
                        >
                            <Checkbox>
                            I intend to use care features
                            </Checkbox>
                        </Form.Item>    
                        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0, marginTop: 0 }}>
                            <Button type="primary" htmlType='submit' disabled={loading}>Create Account</Button>
                        </Form.Item>
                    </Form>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ display: 'inline' }}>
                        Already have an account? <a href="/login">Login</a>
                        </p>
                    </div>
                </Card>
                
            </div>
            
        </>
  )
}
