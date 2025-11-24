import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaIdCard, FaShieldAlt } from 'react-icons/fa';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  padding: 2rem;
  position: relative;
`;

const RegisterCard = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #E0E0E0;
  padding: 2.5rem;
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 2;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AdminIcon = styled.div`
  font-size: 3rem;
  color: #3e6d4a;
  margin-bottom: 1rem;
`;

const RegisterTitle = styled.h1`
  font-size: 2.5rem;
  color: #333333;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-shadow: none;
`;

const RegisterSubtitle = styled.p`
  color: #666666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.8rem;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  transition: all 0.25s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #333333;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
  }

  &.error {
    border-color: #dc3545;
    background: #FFF6F6;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999999;
  font-size: 1.2rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: #3e6d4a;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  background: #3e6d4a;
  color: #FFFFFF;
  border: none;
  padding: 1.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: #2c5036;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: #3e6d4a;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e1e5e9;
  }
  
  span {
    background: #FFFFFF;
    padding: 0 1rem;
    color: #666666;
    font-size: 0.875rem;
  }
`;

const LinkButton = styled(Link)`
  display: block;
  text-align: center;
  color: #3e6d4a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #2c5036;
  }
`;

const UserLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666666;
  
  a {
    color: #3e6d4a;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: #2c5036;
    }
  }
`;

const AdminRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userData = { ...data, role: 'admin' };
      const result = await registerUser(userData);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError('root', { message: result.message });
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <AdminIcon>
            <FaShieldAlt />
          </AdminIcon>
          <RegisterTitle>Admin Registration</RegisterTitle>
          <RegisterSubtitle>Create admin account for library management</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <InputIcon><FaUser /></InputIcon>
              <Input
                type="text"
                placeholder="First Name"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'First name must be at least 2 characters' }
                })}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <InputIcon><FaUser /></InputIcon>
              <Input
                type="text"
                placeholder="Last Name"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                })}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <InputIcon><FaIdCard /></InputIcon>
            <Input
              type="text"
              placeholder="Username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
              })}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <InputIcon><FaEnvelope /></InputIcon>
            <Input
              type="email"
              placeholder="Admin email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              })}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <InputIcon><FaLock /></InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Admin password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className={errors.password ? 'error' : ''}
            />
            <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <InputIcon><FaLock /></InputIcon>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className={errors.confirmPassword ? 'error' : ''}
            />
            <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </FormGroup>

          {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </SubmitButton>
        </Form>
        <br></br>
        <hr/>
        <br></br>
        
        <LinkButton to="/admin/login"><span>Already have an account ?</span> Sign In</LinkButton>

      </RegisterCard>
    </RegisterContainer>
  );
};

export default AdminRegister;
