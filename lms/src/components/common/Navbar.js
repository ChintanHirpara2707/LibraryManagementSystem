import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import tattvaLogo from '../../Tattva.png';
import { FaBook, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCog } from 'react-icons/fa';
import styled from 'styled-components';

/* ===================== STYLED COMPONENTS ===================== */
const NavbarContainer = styled.nav`
  background: #FFFFFF;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: saturate(120%) blur(6px);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  height: 110px;   /* make logo bigger */
  width: auto;
  padding: 4px;
  object-fit: contain; /* ensures logo doesn’t distort */
`;
const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  position: relative;
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.25rem;
  transition: color 0.25s ease;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -6px;
    height: 2px;
    width: 0;
    background: #000000;
    transition: width 0.25s ease;
  }

  &:hover {
    color: #000000;
  }

  &:hover:after {
    width: 100%;
  }

  &.active {
    color: #000000;
    font-weight: 600;
  }

  &.active:after {
    width: 100%;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: #333333;
  border: 1px solid #333333;
  color: #FFFFFF;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(17, 26, 25, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #000000;
    color: #FFFFFF;
    border-color: #000000;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  z-index: 2000;
  overflow: hidden;
  margin-top: 0.5rem;
  border: 1px solid #E0E0E0;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: all 0.3s ease;

  &.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #333333;
  text-decoration: none;
  transition: background 0.25s ease, color 0.25s ease, transform 0.2s ease;

  &:hover {
    background: #F5F5F5;
    color: #000000;
    transform: translateX(2px);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #dc3545;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #fff5f5;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #333333;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245, 245, 245, 0.98);
  z-index: 1500;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
  transition: opacity 0.25s ease, transform 0.25s ease;

  &.open {
    display: flex;
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const MobileNavLink = styled(Link)`
  color: #333333;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 500;

  &.active {
    color: #000000;
  }

  &:hover {
    color: #000000;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #333333;
  font-size: 2rem;
  cursor: pointer;
`;

/* ===================== COMPONENT ===================== */
const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <NavbarContainer>
      <NavContent>
        {/* LOGO */}
        <Logo to="/">
          <LogoImage src={tattvaLogo} alt="Tattva Logo" loading="eager" />
        </Logo>

        {/* DESKTOP LINKS */}
        <NavLinks>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/books" className={isActive('/books') ? 'active' : ''}>
            Books
          </NavLink>
          <NavLink to="/about" className={isActive('/about') ? 'active' : ''}>
            About
          </NavLink>
        </NavLinks>

        {/* USER MENU */}
        <UserMenu ref={dropdownRef}>
          {user ? (
            <>
              <UserButton onClick={() => setShowDropdown((prev) => !prev)}>
                <FaUser />
                {user.firstName}
              </UserButton>

              <DropdownMenu className={showDropdown ? 'open' : ''}>
                {isAdmin ? (
                  <>
                    <DropdownItem to="/admin/dashboard" onClick={() => setShowDropdown(false)}>
                      <FaCog /> Admin Dashboard
                    </DropdownItem>
                    <DropdownItem to="/admin/profile" onClick={() => setShowDropdown(false)}>
                      <FaUser /> Admin Profile
                    </DropdownItem>
                    <DropdownItem to="/admin/books" onClick={() => setShowDropdown(false)}>
                      <FaBook /> Book Management
                    </DropdownItem>
                    <DropdownItem to="/admin/users" onClick={() => setShowDropdown(false)}>
                      <FaUser /> User Management
                    </DropdownItem>
                    <DropdownItem to="/admin/transactions" onClick={() => setShowDropdown(false)}>
                      <FaBook /> Transaction
                    </DropdownItem>
                  </>
                ) : (
                  <>
                    <DropdownItem to="/dashboard" onClick={() => setShowDropdown(false)}>
                      <FaUser /> Dashboard
                    </DropdownItem>
                    <DropdownItem to="/profile" onClick={() => setShowDropdown(false)}>
                      <FaUser /> Profile
                    </DropdownItem>
                    <DropdownItem to="/transactions" onClick={() => setShowDropdown(false)}>
                      <FaBook /> My Transactions
                    </DropdownItem>
                    <DropdownItem to="/books" onClick={() => setShowDropdown(false)}>
                      <FaBook /> Books
                    </DropdownItem>
                  </>
                )}
                <LogoutButton onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </LogoutButton>
              </DropdownMenu>
            </>
          ) : (
            <>
              <NavLink to="/login" className={isActive('/login') ? 'active' : ''}>
                Login
              </NavLink>
              <NavLink to="/register" className={isActive('/register') ? 'active' : ''}>
                Register
              </NavLink>
            </>
          )}
        </UserMenu>

        {/* MOBILE MENU BUTTON */}
        <MobileMenuButton aria-label="Toggle menu" onClick={() => setShowMobileMenu(true)}>
          <FaBars />
        </MobileMenuButton>
      </NavContent>

      {/* MOBILE MENU */}
      <MobileMenu className={showMobileMenu ? 'open' : ''}>
        <CloseButton aria-label="Close menu" onClick={() => setShowMobileMenu(false)}>
          <FaTimes />
        </CloseButton>

        <MobileNavLink to="/" className={isActive('/') ? 'active' : ''} onClick={() => setShowMobileMenu(false)}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/books" className={isActive('/books') ? 'active' : ''} onClick={() => setShowMobileMenu(false)}>
          Books
        </MobileNavLink>
        <MobileNavLink to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setShowMobileMenu(false)}>
          About
        </MobileNavLink>

        {user ? (
          <>
            {isAdmin ? (
              <>
                <MobileNavLink to="/admin/dashboard" onClick={() => setShowMobileMenu(false)}>
                  Admin Dashboard
                </MobileNavLink>
                <MobileNavLink to="/admin/profile" onClick={() => setShowMobileMenu(false)}>
                  Admin Profile
                </MobileNavLink>
                <MobileNavLink to="/admin/books" onClick={() => setShowMobileMenu(false)}>
                  Book Management
                </MobileNavLink>
                <MobileNavLink to="/admin/users" onClick={() => setShowMobileMenu(false)}>
                  User Management
                </MobileNavLink>
                <MobileNavLink to="/admin/transactions" onClick={() => setShowMobileMenu(false)}>
                  Transaction Management
                </MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/dashboard" onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setShowMobileMenu(false)}>
                  Profile
                </MobileNavLink>
                <MobileNavLink to="/transactions" onClick={() => setShowMobileMenu(false)}>
                  My Transactions
                </MobileNavLink>
                <MobileNavLink to="/books" onClick={() => setShowMobileMenu(false)}>
                  Books
                </MobileNavLink>
              </>
            )}
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </LogoutButton>
          </>
        ) : (
          <>
            <MobileNavLink to="/login" className={isActive('/login') ? 'active' : ''} onClick={() => setShowMobileMenu(false)}>
              Login
            </MobileNavLink>
            <MobileNavLink to="/register" className={isActive('/register') ? 'active' : ''} onClick={() => setShowMobileMenu(false)}>
              Register
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </NavbarContainer>
  );
};

export default Navbar;
