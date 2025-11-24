import { React } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaSearch, FaShieldAlt, FaClock, FaGraduationCap } from 'react-icons/fa';
import tattvaLogo from '../assets/Tattva.png';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(180deg, #FFFFFF 0%,rgba(46, 43, 43, 0.06) 100%);
  color: #333333;
  padding: 6rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.primary {
    background: #3e6d4a;
    color: #FFFFFF;
    
    &:hover {
      background: #2c5036;
      transform: translateY(-2px);
      box-shadow: #2c5036;
    }
  }
  
  &.secondary {
    background: transparent;
    color: #2c5036;
    border: 2px solid #3e6d4a;
    
    &:hover {
      background: #3e6d4a;
      border-color: #2c5036;
      color: #FFFFFF;
      transform: translateY(-2px);
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background: #FFFFFF;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333333;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.18), 0 6px 18px rgba(0,0,0,0.12);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #3e6d4a;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.06));
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333333;
`;

const FeatureDescription = styled.p`
  color: #666666;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 5rem 0;
  background: white;
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatCard = styled.div`
  padding: 2rem;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 3px 10px rgba(0,0,0,0.08);
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666666;
  font-size: 1.1rem;
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background: linear-gradient(180deg, #F5F5F5 0%, #FFFFFF 100%);
  color: #333333;
  text-align: center;
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #FFFFFF;
  border-radius: 14px;
  box-shadow: 0 14px 40px rgba(0,0,0,0.14), 0 4px 14px rgba(0,0,0,0.10);
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Home = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Welcome to Tattva Library</HeroTitle>
          <HeroSubtitle>
            Discover thousands of books, manage your reading journey, and explore the world of knowledge
            through our comprehensive library management system.
          </HeroSubtitle>
          <HeroButtons>
            <Button to="/books" className="primary">
              Browse Books
            </Button>
            <Button to="/register" className="secondary">
              Get Started
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose Tattva Library?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FaBook />
              </FeatureIcon>
              <FeatureTitle>Extensive Collection</FeatureTitle>
              <FeatureDescription>
                Access thousands of books across various genres, from classic literature to modern bestsellers.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaSearch />
              </FeatureIcon>
              <FeatureTitle>Easy Discovery</FeatureTitle>
              <FeatureDescription>
                Find your next favorite book with our advanced search and recommendation system.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaUsers />
              </FeatureIcon>
              <FeatureTitle>Community</FeatureTitle>
              <FeatureDescription>
                Join a community of readers, share reviews, and discover new books together.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaShieldAlt />
              </FeatureIcon>
              <FeatureTitle>Secure & Reliable</FeatureTitle>
              <FeatureDescription>
                Your data is safe with our secure platform and reliable book management system.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaClock />
              </FeatureIcon>
              <FeatureTitle>Quick Access</FeatureTitle>
              <FeatureDescription>
                Instant access to digital resources and efficient book checkout process for physical copies.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaGraduationCap />
              </FeatureIcon>
              <FeatureTitle>Learning Resources</FeatureTitle>
              <FeatureDescription>
                Access to educational materials, research papers, and academic publications for enhanced learning.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <StatsSection>
        <StatsContainer>
          <SectionTitle>Library Statistics</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>10,000+</StatNumber>
              <StatLabel>Books Available</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>5,000+</StatNumber>
              <StatLabel>Active Members</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50+</StatNumber>
              <StatLabel>Categories</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Online Access</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsContainer>
      </StatsSection>

      <CTASection>
        <CTAContainer>
          <CTATitle>Ready to Start Your Reading Journey?</CTATitle>
          <CTADescription>
            Join thousands of readers who have already discovered the joy of reading with Tattva Library.
            Create your account today and unlock unlimited access to knowledge.
          </CTADescription>
          <HeroButtons>
            <Button to="/register" className="primary">
              Sign Up Now
            </Button>
            <Button to="/about" className="secondary">
              Learn More
            </Button>
          </HeroButtons>
        </CTAContainer>
      </CTASection>
    </HomeContainer>
  );
};

export default Home;
