import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import tattvaLogo from '../../assets/Tattva.png';
import { FaBook, FaClock, FaCheckCircle, FaExclamationTriangle, FaUser, FaCalendarAlt } from 'react-icons/fa';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const DashboardHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: #2c5036;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #294328;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #81927c;
  font-size: 1.1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #294328;
  margin-bottom: 1.5rem;
`;

const QuickActions = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f3f3f3 0%);
  color: #3e6d4a;
  text-decoration: none;
  border-radius: 15px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    color: #2c5036;
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ActionText = styled.div`
  font-weight: 600;
  text-align: center;
`;

const RecentActivity = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #3e6d4a;
`;

const ActivityIcon = styled.div`
  font-size: 1.2rem;
  color: #3e6d4a;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #294328;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  color: #81927c;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #81927c;
`;

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    booksBorrowed: 0,
    booksRead: 0,
    currentBorrows: 0,
    overdueBooks: 0
  });
  const [recent, setRecent] = useState([]);

  const mapActivityIcon = (tx) => {
    if (tx.type === 'borrow') return <FaBook />;
    if (tx.type === 'purchase') return <FaBook />;
    return <FaCheckCircle />;
  };

  const fetchMyTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/transactions/my', { params: { page: 1, limit: 20 } });
      const txs = res.data.transactions || [];

      const totalBorrows = txs.filter(t => t.type === 'borrow').length;
      const booksRead = txs.filter(t => t.type === 'borrow' && t.status === 'completed').length;
      const currentBorrows = txs.filter(t => t.type === 'borrow' && t.status === 'active').length;
      const overdueBooks = txs.filter(t => t.type === 'borrow' && t.status === 'overdue').length;

      setStats({
        booksBorrowed: totalBorrows,
        booksRead,
        currentBorrows,
        overdueBooks
      });

      const recentActivities = txs.slice(0, 6).map(t => ({
        id: t._id || t.id,
        type: t.type,
        title: t.book?.title || 'Untitled',
        time: new Date(t.createdAt).toLocaleDateString(),
        icon: mapActivityIcon(t)
      }));
      setRecent(recentActivities);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard');
      setStats({ booksBorrowed: 0, booksRead: 0, currentBorrows: 0, overdueBooks: 0 });
      setRecent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardHeader>
          <img src={tattvaLogo} alt="Tattva Logo" style={{ height: '80px', marginBottom: '20px' }} />
          <WelcomeTitle>Welcome back, {user?.firstName}!</WelcomeTitle>
          <WelcomeSubtitle>
            Here's what's happening with your library account
          </WelcomeSubtitle>
        </DashboardHeader>

        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FaBook />
            </StatIcon>
            <StatNumber>{stats.booksBorrowed}</StatNumber>
            <StatLabel>Books Borrowed</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaCheckCircle />
            </StatIcon>
            <StatNumber>{stats.booksRead}</StatNumber>
            <StatLabel>Books Read</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaClock />
            </StatIcon>
            <StatNumber>{stats.currentBorrows}</StatNumber>
            <StatLabel>Currently Borrowing</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaExclamationTriangle />
            </StatIcon>
            <StatNumber>{stats.overdueBooks}</StatNumber>
            <StatLabel>Overdue Books</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActions>
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionsGrid>
            <ActionCard to="/books">
              <ActionIcon>
                <FaBook />
              </ActionIcon>
              <ActionText>Browse Books</ActionText>
            </ActionCard>
            
            <ActionCard to="/transactions">
              <ActionIcon>
                <FaClock />
              </ActionIcon>
              <ActionText>My Transactions</ActionText>
            </ActionCard>
            
            <ActionCard to="/profile">
              <ActionIcon>
                <FaUser />
              </ActionIcon>
              <ActionText>Update Profile</ActionText>
            </ActionCard>
            
            <ActionCard to="/books">
              <ActionIcon>
                <FaCalendarAlt />
              </ActionIcon>
              <ActionText>Return Books</ActionText>
            </ActionCard>
          </ActionsGrid>
        </QuickActions>

        <RecentActivity>
          <SectionTitle>Recent Activity</SectionTitle>
          {loading ? (
            <EmptyState>
              <p>Loading your recent activity...</p>
            </EmptyState>
          ) : recent.length > 0 ? (
            <ActivityList>
              {recent.map((activity) => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon>
                    {activity.icon}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{activity.title}</ActivityTitle>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityList>
          ) : (
            <EmptyState>
              <p>No recent activity to show.</p>
              <p>Start by browsing our book collection!</p>
            </EmptyState>
          )}
        </RecentActivity>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default UserDashboard;
