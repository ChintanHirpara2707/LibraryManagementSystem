import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalCard = styled.div`
  background: rgba(17, 26, 25, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #f7d7a8;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #81927c;
  cursor: pointer;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #c96e34;
  }
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #81927c;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  background: rgba(129, 146, 124, 0.1);
  border: 1px solid #294328;
  border-radius: 8px;
  font-size: 1rem;
  color: #f7d7a8;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #81927c;
  }

  &:focus {
    outline: none;
    border-color: #c96e34;
    background: rgba(129, 146, 124, 0.15);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  &.cancel {
    background: #333;
    color: #f7d7a8;

    &:hover {
      background: #444;
    }
  }

  &.primary {
    background: #294328;
    color: #f7d7a8;

    &:hover {
      background: #c96e34;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      background: #294328;
    }
  }
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

const ForgotPassword = ({ onClose, onSuccess }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = email input, 2 = success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setStep(2);
        if (onSuccess) onSuccess(result.data);

        // Dev only logs
        if (result.data && result.data.resetToken) {
          console.log("Reset Token:", result.data.resetToken);
          console.log(
            "Reset URL:",
            `${window.location.origin}/reset-password?token=${result.data.resetToken}`
          );
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setStep(1);
    setLoading(false);
    if (onClose) onClose();
  };

  // ✅ Success Step
  if (step === 2) {
    return (
      <Overlay>
        <ModalCard>
          <div style={{ textAlign: "center" }}>
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
            <h3 style={{ color: "#f7d7a8", marginBottom: "0.5rem" }}>
              Check Your Email
            </h3>
            <p style={{ color: "#81927c", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions.
            </p>
            <Button className="primary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </ModalCard>
      </Overlay>
    );
  }

  // ✅ Input Step
  return (
    <Overlay>
      <ModalCard>
        <ModalHeader>
          <h3>Forgot Password</h3>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <Description>
          Enter your email address and we'll send you a link to reset your password.
        </Description>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />

          <ButtonRow>
            <Button type="button" className="cancel" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="primary" disabled={loading || !email}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </ButtonRow>
        </form>
      </ModalCard>
    </Overlay>
  );
};

export default ForgotPassword;
