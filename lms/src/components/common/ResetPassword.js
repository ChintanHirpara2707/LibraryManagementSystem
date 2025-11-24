import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaEnvelope,FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import styled from "styled-components";

// === Styled Components ===
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0b1210;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: rgba(17, 26, 25, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #f7d7a8;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const SubText = styled.p`
  font-size: 0.95rem;
  color: #81927c;
  text-align: center;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.8rem; /* space between fields, matches login page */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.8rem; /* space for left icon */
  background: rgba(129, 146, 124, 0.1);
  border: 1px solid #294328;
  border-radius: 8px;
  font-size: 1rem;
  color: #f7d7a8;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #81927c;
  }

  &:focus {
    outline: none;
    border-color: #c96e34;
    background: rgba(129, 146, 124, 0.15);
  }

  &.error {
    border-color: #dc3545;
    background: rgba(220, 53, 69, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.9rem; /* same as login page */
  top: 50%;
  transform: translateY(-50%);
  color: #81927c;
  font-size: 1.1rem;
  pointer-events: none;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 0.9rem; /* same as login page */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #81927c;
  cursor: pointer;
  font-size: 1.1rem;

  &:hover {
    color: #c96e34;
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
  text-align: center;
`;


const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem 1rem;
  background: #294328;
  color: #f7d7a8;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c96e34;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: #294328;
  }
`;

const SuccessWrapper = styled.div`
  text-align: center;
  color: #f7d7a8;
`;

const SuccessIcon = styled.div`
  margin: 0 auto 1rem;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  background: rgba(0, 128, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #22c55e;
    height: 1.5rem;
    width: 1.5rem;
  }
`;

// === Component ===
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, resetPasswordDirect } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return minLength && hasLower && hasUpper && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token && !formData.email) {
      setError("Email is required");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setError(
        "Password must be at least 6 characters with uppercase, lowercase, and number"
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = token
        ? await resetPassword(token, formData.newPassword)
        : await resetPasswordDirect(formData.email, formData.newPassword);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageWrapper>
        <Card>
          <SuccessWrapper>
            <SuccessIcon>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </SuccessIcon>
            <h2>Password Reset Successful</h2>
            <SubText>
              Your password has been reset successfully. Redirecting you to the
              login page...
            </SubText>
          </SuccessWrapper>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card>
        <Title>Reset Your Password</Title>
        <SubText>
          {token
            ? "Enter your new password below"
            : "Enter your email and new password"}
        </SubText>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          {!token && (
            <InputWrapper>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          )}

          {/* New Password Field */}
          <InputWrapper>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </ToggleButton>
          </InputWrapper>

          {/* Confirm Password Field */}
          <InputWrapper>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <ToggleButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </ToggleButton>
          </InputWrapper>


          {error && <ErrorText>{error}</ErrorText>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Resetting Password..." : "Reset Password"}
          </SubmitButton>
        </form>
      </Card>
    </PageWrapper>
  );
};

export default ResetPassword;
