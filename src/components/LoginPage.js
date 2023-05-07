import React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Card, Alert } from 'antd';
import { useAuth, login } from '../contexts/AuthContext'
import { useNavigate, useHistory } from 'react-router-dom';
import weather from "../weather"


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

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, currentUser } = useAuth()
    const [loading, setLoading] = useState('')
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    // const history = useHistory()

    const submitHandler = async (values) => {

        try {
            setAlertMessage('')
            setLoading(true)
            await login(values.email, values.password)
            const url = 'http://localhost:8000/api/login';
            const data = {
              Email: values.email,
            };
        
            await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
              let id = result._id
              let email = result.Email
              let name = result.Name
              
              console.log(result)
              localStorage.setItem('CARE_CAL_ID', id)
              localStorage.setItem('CARE_CAL_EMAIL', email)
              localStorage.setItem('CARE_CAL_NAME', name)
            })
            .catch(error => {
    
              console.error('Error:', error);
            });

            
            setAlertMessage("Success! Redirecting you to the dashboard.")
            setAlertType('success')
            setTimeout(() => {
                navigate('/dashboard')
            }, 1500)
            
        }
        catch {
            setAlertMessage('User not found. Please check your username and/or password.')
            setAlertType('error')
            console.log("failed")
        }
        setLoading(false)
      };

    return (
        <>
            <div style={{ backgroundColor: '#f2f2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Card title="Log In" bordered={true} style={{ width: 500 }}>
                {alertMessage && (
                    <Alert
                    message={alertMessage}
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
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0, marginTop: 0 }}>
                            <Button type="primary" htmlType='submit' disabled={loading}>Login</Button>
                        </Form.Item>
                    </Form>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ display: 'inline' }}>
                        New User? <a href="/register">Register now!</a>
                        </p>
                    </div>
                </Card>
                
            </div>
            
        </>
  )
}
