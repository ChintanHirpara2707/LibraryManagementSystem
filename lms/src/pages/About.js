import { React } from 'react';
import { FaBook, FaUsers, FaShieldAlt, FaHeart } from 'react-icons/fa';
import styled from 'styled-components';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
`;

const HeroSection = styled.section`
  background: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);
  color: #333333;
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ContentSection = styled.section`
  padding: 5rem 0;
`;

const ContentContainer = styled.div`
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

const MissionSection = styled.div`
  background: #FFFFFF;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #E0E0E0;
  margin-bottom: 3rem;
  text-align: center;
`;

const MissionTitle = styled.h3`
  font-size: 2rem;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const MissionText = styled.p`
  font-size: 1.1rem;
  color: #666666;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 44px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.12);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #333333;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h4`
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666666;
  line-height: 1.6;
`;

const TeamSection = styled.div`
  background: #FFFFFF;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #E0E0E0;
  text-align: center;
`;

const TeamTitle = styled.h3`
  font-size: 2rem;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const TeamText = styled.p`
  font-size: 1.1rem;
  color: #666666;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
`;

const ContactSection = styled.div`
  background: #FFFFFF;
  color: #333333;
  padding: 3rem;
  border-radius: 15px;
  border: 1px solid #E0E0E0;
  text-align: center;
  margin-top: 3rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0,0,0,0.08);
`;

const ContactTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const ContactText = styled.p`
  color: #666666;
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const ContactEmail = styled.a`
  color: #333333;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  
  &:hover {
    color: #000000;
    text-decoration: underline;
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>About Tattva Library</HeroTitle>
          <HeroSubtitle>
            Empowering readers and librarians with a modern, comprehensive library management solution
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <ContentContainer>
          <MissionSection>
            <MissionTitle>Our Mission</MissionTitle>
            <MissionText>
              At Tattva Library, we believe that knowledge should be accessible to everyone. 
              Our mission is to provide a comprehensive, user-friendly library management system 
              that connects readers with the books they love while empowering librarians with 
              powerful tools to manage their collections effectively.
            </MissionText>
          </MissionSection>

          <SectionTitle>What We Offer</SectionTitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FaBook />
              </FeatureIcon>
              <FeatureTitle>Comprehensive Book Management</FeatureTitle>
              <FeatureDescription>
                Our system provides complete book cataloging, inventory management, and 
                search capabilities to help users find exactly what they're looking for.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaUsers />
              </FeatureIcon>
              <FeatureTitle>User-Friendly Experience</FeatureTitle>
              <FeatureDescription>
                Designed with both librarians and readers in mind, our platform offers 
                an intuitive interface that makes library management and book discovery effortless.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaShieldAlt />
              </FeatureIcon>
              <FeatureTitle>Secure & Reliable</FeatureTitle>
              <FeatureDescription>
                Built with modern security standards, our platform ensures that your data 
                and transactions are protected while maintaining high availability.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>

          <TeamSection>
            <TeamTitle>Our Team</TeamTitle>
            <TeamText>
              We are a passionate team of developers, designers, and library professionals 
              dedicated to creating innovative solutions for modern libraries. Our expertise 
              in technology and understanding of library operations drives us to continuously 
              improve and expand our platform.
            </TeamText>
          </TeamSection>

          <ContactSection>
            <ContactTitle>Get in Touch</ContactTitle>
            <ContactText>
              Have questions, suggestions, or need support? We'd love to hear from you!
            </ContactText>
            <ContactEmail href="mailto:contact@tattvalibrary.com">
              contact@tattvalibrary.com
            </ContactEmail>
          </ContactSection>
        </ContentContainer>
      </ContentSection>
    </AboutContainer>
  );
};

export default About;
