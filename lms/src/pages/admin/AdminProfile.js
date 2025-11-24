import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaEdit, FaSave, FaTimes, FaShieldAlt, FaLock } from 'react-icons/fa';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 2rem 0;
`;

const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ProfileHeader = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  text-align: center;
`;

const ProfileTitle = styled.h1`
  font-size: 2.5rem;
  color: #333333;
  margin-bottom: 0.5rem;
`;

const ProfileSubtitle = styled.p`
  color: #666666;
  font-size: 1.1rem;
`;

const AdminBadge = styled.div`
  background: #F5F5F5;
  color: #333333;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ProfileCard = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #333333;
  margin: 0;
`;

const EditButton = styled.button`
  background: #3e6d4a;
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: #2c5036;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  padding: 0.9rem 1rem 0.9rem 2.8rem; /* left padding for icons */
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
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
    background: rgba(220, 53, 69, 0.1);
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: #999999;
  pointer-events: none;
`;


const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.4rem;
  display: block;
`;


const SubmitButton = styled.button`
  background: #3e6d4a;
  color: #FFFFFF;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: #2c5036;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #333333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoValue = styled.div`
  color: #666666;
`;

const AdminProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || ''
      }
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setIsEditing(false);
        reset(data);
      } else {
        setError('root', { message: result.message });
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  // Change password form
  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: errorsPwd },
    setError: setErrorPwd,
    reset: resetPwd
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      setErrorPwd('confirmNewPassword', { message: 'Passwords do not match' });
      return;
    }
    setIsChanging(true);
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        resetPwd();
      } else {
        setErrorPwd('root', { message: result.message || 'Password change failed' });
      }
    } catch (e) {
      setErrorPwd('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsChanging(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileHeader>
          <ProfileTitle>Admin Profile</ProfileTitle>
          <ProfileSubtitle>Manage your administrator account</ProfileSubtitle>
          <AdminBadge>
            <FaShieldAlt />
            Administrator
          </AdminBadge>
        </ProfileHeader>

        <ProfileCard>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            {!isEditing && (
              <EditButton onClick={() => setIsEditing(true)}>
                <FaEdit />
                Edit Profile
              </EditButton>
            )}
          </CardHeader>

          {isEditing ? (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormRow>
                <FormGroup>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="First Name"
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      }
                    })}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <InputIcon>
                  <FaPhone />
                </InputIcon>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  {...register('phone')}
                />
              </FormGroup>

              <FormGroup>
                <InputIcon>
                  <FaMapMarkerAlt />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Street Address"
                  {...register('address.street')}
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <InputIcon>
                    <FaMapMarkerAlt />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="City"
                    {...register('address.city')}
                  />
                </FormGroup>

                <FormGroup>
                  <InputIcon>
                    <FaMapMarkerAlt />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="State/Province"
                    {...register('address.state')}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <InputIcon>
                    <FaMapMarkerAlt />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="ZIP/Postal Code"
                    {...register('address.zipCode')}
                  />
                </FormGroup>

                <FormGroup>
                  <InputIcon>
                    <FaMapMarkerAlt />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="Country"
                    {...register('address.country')}
                  />
                </FormGroup>
              </FormRow>

              {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancel}>
                  <FaTimes style={{ marginRight: '0.5rem' }} />
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={isLoading}>
                  <FaSave style={{ marginRight: '0.5rem' }} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          ) : (
            <div>
              <InfoRow>
                <InfoLabel>
                  <FaUser />
                  Full Name
                </InfoLabel>
                <InfoValue>{user?.firstName} {user?.lastName}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <FaEnvelope />
                  Email
                </InfoLabel>
                <InfoValue>{user?.email}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <FaIdCard />
                  Username
                </InfoLabel>
                <InfoValue>{user?.username}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <FaShieldAlt />
                  Role
                </InfoLabel>
                <InfoValue>Administrator</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <FaPhone />
                  Phone
                </InfoLabel>
                <InfoValue>{user?.phone || 'Not provided'}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <FaMapMarkerAlt />
                  Address
                </InfoLabel>
                <InfoValue>
                  {user?.address?.street ? (
                    <>
                      {user.address.street}<br />
                      {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                      {user.address.country}
                    </>
                  ) : (
                    'Not provided'
                  )}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <FaIdCard />
                  Admin Since
                </InfoLabel>
                <InfoValue>{formatDate(user?.createdAt)}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <FaIdCard />
                  Last Login
                </InfoLabel>
                <InfoValue>{formatDate(user?.lastLogin)}</InfoValue>
              </InfoRow>
            </div>
          )}
        </ProfileCard>

        <ProfileCard>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>

          <Form onSubmit={handleSubmitPwd(onSubmitPassword)}>
            <FormGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                placeholder="Current Password"
                {...registerPwd('currentPassword', { required: 'Current password is required' })}
                className={errorsPwd.currentPassword ? 'error' : ''}
              />
              {errorsPwd.currentPassword && <ErrorMessage>{errorsPwd.currentPassword.message}</ErrorMessage>}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  placeholder="New Password"
                  {...registerPwd('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'At least 6 characters' }
                  })}
                  className={errorsPwd.newPassword ? 'error' : ''}
                />
                {errorsPwd.newPassword && <ErrorMessage>{errorsPwd.newPassword.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  {...registerPwd('confirmNewPassword', { required: 'Please confirm your new password' })}
                  className={errorsPwd.confirmNewPassword ? 'error' : ''}
                />
                {errorsPwd.confirmNewPassword && <ErrorMessage>{errorsPwd.confirmNewPassword.message}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            {errorsPwd.root && <ErrorMessage>{errorsPwd.root.message}</ErrorMessage>}

            <ButtonGroup>
              <SubmitButton type="submit" disabled={isChanging}>
                <FaSave style={{ marginRight: '0.5rem' }} />
                {isChanging ? 'Changing...' : 'Change Password'}
              </SubmitButton>
            </ButtonGroup>
          </Form>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default AdminProfile;
