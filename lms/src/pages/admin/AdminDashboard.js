import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import tattvaLogo from '../../assets/Tattva.png';
import { 
  FaBook, 
  FaUsers, 
  FaExchangeAlt, 
  FaExclamationTriangle, 
  FaPlus, 
  FaCog, 
  FaChartBar,
  FaUserPlus,
  FaClipboardList
} from 'react-icons/fa';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 2rem 0;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const DashboardHeader = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid #E0E0E0;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.2rem;
  color: #333333;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const WelcomeSubtitle = styled.p`
  color: #666666;
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #E0E0E0;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #CCCCCC;
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: #3e6d4a;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.2rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666666;
  font-size: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const ManagementSection = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  border: 1px solid #E0E0E0;
`;

const ManagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ManagementCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #FFFFFF;
  color: #2c5036;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #E0E0E0;
  
  &:hover {
    transform: translateY(-5px);
    color: #000000;
    border-color: #CCCCCC;
    background: #F5F5F5;
  }
`;

const ManagementIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ManagementTitle = styled.div`
  font-weight: 600;
  text-align: center;
  font-size: 1.1rem;
`;

const QuickActions = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  border: 1px solid #E0E0E0;
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
  background: #FFFFFF;
  color: #333333;
  text-decoration: none;
  border-radius: 15px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
  
  &:hover {
    background: #F5F5F5;
    transform: translateY(-3px);
    color: #000000;
    border-color: #CCCCCC;
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  color: #3e6d4a;
  margin-bottom: 1rem;
`;

const ActionText = styled.div`
  font-weight: 600;
  text-align: center;
`;

const RecentActivity = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #E0E0E0;
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
  background: #FFFFFF;
  border-radius: 10px;
  border-left: 4px solid #3e6d4a;
  border: 1px solid #E0E0E0;
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
  color: #333333;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  color: #666666;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666666;
`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    overdueBooks: 0
  });
  const [recent, setRecent] = useState([]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      // Users overview
      const usersRes = await axios.get('/api/users/stats/overview');
      // Transactions overview
      const txRes = await axios.get('/api/transactions/stats/overview');
      // Books count — reuse books endpoint first page and header pagination if available; fall back to list length
      const booksRes = await axios.get('/api/books', { params: { page: 1, limit: 1 } });

      const totalUsers = usersRes.data?.stats?.total || 0;
      const activeBorrows = txRes.data?.stats?.byStatus?.active || 0;
      const overdueBooks = txRes.data?.stats?.byStatus?.overdue || 0;
      const totalBooks = booksRes.data?.pagination?.totalBooks || booksRes.data?.total || booksRes.data?.books?.length || 0;

      setStats({ totalBooks, totalUsers, activeBorrows, overdueBooks });

      // Recent activity: synthesize from latest transactions
      const latestTx = await axios.get('/api/transactions', { params: { page: 1, limit: 6, sortBy: 'createdAt', sortOrder: 'desc' } });
      const items = (latestTx.data.transactions || []).map(t => ({
        id: t._id || t.id,
        type: t.type,
        title: `${t.type === 'borrow' ? 'Borrow' : t.type === 'purchase' ? 'Purchase' : 'Return'} - ${t.book?.title || 'Untitled'}`,
        time: new Date(t.createdAt).toLocaleString(),
        icon: t.type === 'borrow' ? <FaExchangeAlt /> : t.type === 'purchase' ? <FaClipboardList /> : <FaExchangeAlt />
      }));
      setRecent(items);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard');
      setStats({ totalBooks: 0, totalUsers: 0, activeBorrows: 0, overdueBooks: 0 });
      setRecent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardHeader>
          <img src={tattvaLogo} alt="Tattva Logo" style={{ height: '80px', marginBottom: '20px' }} />
          <WelcomeTitle>Admin Dashboard</WelcomeTitle>
          <WelcomeSubtitle>
            Welcome back, {user?.firstName}! Here's your library overview
          </WelcomeSubtitle>
        </DashboardHeader>

        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FaBook />
            </StatIcon>
            <StatNumber>{stats.totalBooks}</StatNumber>
            <StatLabel>Total Books</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaUsers />
            </StatIcon>
            <StatNumber>{stats.totalUsers}</StatNumber>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaExchangeAlt />
            </StatIcon>
            <StatNumber>{stats.activeBorrows}</StatNumber>
            <StatLabel>Active Borrows</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaExclamationTriangle />
            </StatIcon>
            <StatNumber>{stats.overdueBooks}</StatNumber>
            <StatLabel>Overdue Books</StatLabel>
          </StatCard>
        </StatsGrid>

        <ManagementSection>
          <SectionTitle>Library Management</SectionTitle>
          <ManagementGrid>
            <ManagementCard to="/admin/books">
              <ManagementIcon>
                <FaBook />
              </ManagementIcon>
              <ManagementTitle>Book Management</ManagementTitle>
            </ManagementCard>
            
            <ManagementCard to="/admin/users">
              <ManagementIcon>
                <FaUsers />
              </ManagementIcon>
              <ManagementTitle>User Management</ManagementTitle>
            </ManagementCard>
            
            <ManagementCard to="/admin/transactions">
              <ManagementIcon>
                <FaClipboardList />
              </ManagementIcon>
              <ManagementTitle>Transaction Management</ManagementTitle>
            </ManagementCard>
          </ManagementGrid>
        </ManagementSection>

        <QuickActions>
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionsGrid>
            <ActionCard to="/admin/books">
              <ActionIcon>
                <FaPlus />
              </ActionIcon>
              <ActionText>Add New Book</ActionText>
            </ActionCard>
            
            <ActionCard to="/admin/users/add">
              <ActionIcon>
                <FaUserPlus />
              </ActionIcon>
              <ActionText>Add New Member</ActionText>
            </ActionCard>
            
            <ActionCard to="/admin/transactions">
              <ActionIcon>
                <FaClipboardList />
              </ActionIcon>
              <ActionText>View Transactions</ActionText>
            </ActionCard>
            
            <ActionCard to="/admin/profile">
              <ActionIcon>
                <FaCog />
              </ActionIcon>
              <ActionText>Admin Settings</ActionText>
            </ActionCard>
          </ActionsGrid>
        </QuickActions>

        <RecentActivity>
          <SectionTitle>Recent Activity</SectionTitle>
          {loading ? (
            <EmptyState>
              <p>Loading recent activity...</p>
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
              <p>Start managing your library!</p>
            </EmptyState>
          )}
        </RecentActivity>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;
