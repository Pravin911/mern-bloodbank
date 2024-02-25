import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Radio, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import OrgHospitalForm from '../../components/OrgHospitalForm';
import { RegisterUser } from '../../apis/users';
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../redux/loadersSlice';
import { getAntdInputValidation } from '../../utils/helpers';

export default function Register() {
  const [type, setType] = useState('donar'); // Corrected the declaration of useState
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await RegisterUser({
        ...values,
        userType: type,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []); // Added empty dependency array to useEffect

  return (
    <div className='flex h-screen items-center justify-center'>
      <Form layout="vertical" className="bg-white rounded shadow grid grid-cols-2 p-5 gap-5 w-1/2"
        onFinish={onFinish}
      >
        <h1 className="col-span-2 uppercase font-bold text-2xl">
          <span className="text-blue-300">{type.toUpperCase()} - Register </span>
          <hr />
        </h1>

        <Radio.Group onChange={(e) => setType(e.target.value)} value={type}
          className='col-span-2'
        >
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>

        {type === 'donar' && (
          <>
            <Form.Item label="Name" name="name" rules={getAntdInputValidation()}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={getAntdInputValidation()}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={getAntdInputValidation()}>
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={getAntdInputValidation()}>
              <Input type='password' />
            </Form.Item>
          </>
        )}

        {type !== 'donar' && <OrgHospitalForm type={type} />}

        <Button type="primary" block className='col-span-2'
          htmlType='submit'
        >
          Register
        </Button>
        <Link to="/login" className='col-span-2 text-center text-blue-500 hover:text-blue-300'>Already have an account?</Link>
      </Form>
    </div>
  )
}
