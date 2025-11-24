import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import styled from 'styled-components';
import tattvaLogo from '../../Tattva.png';

const FooterContainer = styled.footer`
  background: #FFFFFF;
  color: #333333;
  padding: 3rem 0 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;
const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333333;
  font-size: 1.5rem;
  font-weight: bold;
  
  &:hover {
    color: #000000;
  }
`;

const LogoImage = styled.img`
  height: 100px;
  width: auto;
  padding: 8px;
`;


const FooterSection = styled.div`
  h3 {
    color: #333333;
    margin-bottom: 1.2rem;
    font-size: 1.3rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  p, a {
    color: #666666;
    line-height: 1.8;
    margin-bottom: 0.75rem;
    display: block;
    font-size: 0.95rem;
  }
  
  a {
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 0.3rem 0;
    
    &:hover {
      color: #000000;
      transform: translateX(5px);
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #E0E0E0;
  padding-top: 1rem;
  text-align: center;
  color: #666666;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #FFFFFF;
  color: #333333;
  transition: transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    color: #000000;
    border-color: #CCCCCC;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <Logo to="/">
                      <LogoImage src={tattvaLogo} alt="Tattva Logo" loading="eager" />
            </Logo>
            <p>
              Your gateway to knowledge and discovery. Explore thousands of books,
              manage your reading journey, and connect with fellow readers.
            </p>
            <SocialLinks>
              <SocialLink href="#" aria-label="GitHub">
                <FaGithub />
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <FaTwitter />
              </SocialLink>
              <SocialLink href="mailto:contact@tattvalibrary.com" aria-label="Email">
                <FaEnvelope />
              </SocialLink>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/books">Browse Books</Link>
            <Link to="/about">About Us</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </FooterSection>
          
          <FooterSection>
            <h3>User Services</h3>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/transactions">My Transactions</Link>
            <Link to="/books">Book Catalog</Link>
            <Link to="/about">Help & Support</Link>
          </FooterSection>
          
          <FooterSection>
            <h3>Admin Services</h3>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
            <Link to="/admin/books">Book Management</Link>
            <Link to="/admin/users">User Management</Link>
            <Link to="/admin/transactions">Transaction Management</Link>
            <Link to="/admin/profile">Admin Profile</Link>
          </FooterSection>
        </FooterTop>
        
        <FooterBottom>
          <p>&copy; {currentYear} Tattva Library. All rights reserved.</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
