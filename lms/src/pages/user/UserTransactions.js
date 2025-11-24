import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import styled from 'styled-components';

const TransactionsContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
`;

const TransactionsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;

`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1rem;
  font-weight: 500;
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  background: ${props => props.active ? '#294328' : 'white'};
  color: ${props => props.active ? '#ffffffff' : '#294328'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    border-color: #3e6d4a;
    background: ${props => props.active ? '#294328' : '#294328'};
    color: #ffffffff;
  }
`;

const TransactionsList = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TransactionItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f3f3f3 0%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3e6d4a;
  font-size: 1.5rem;
`;

const BookDetails = styled.div`
  flex: 1;
`;

const BookTitle = styled.div`
  font-weight: 600;
  color: #3e6d4a;
  margin-bottom: 0.25rem;
`;

const BookAuthor = styled.div`
  color: #3e6d4a;
  font-size: 0.9rem;
`;

const TransactionType = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  
  &.borrow {
    background: #e3f2ed;
    color: #3e6d4a;
  }
  
  &.purchase {
    background: #fff3e6;
    color: #3e6d4a;
  }
  
  &.return {
    background: #f7d7a8;
    color: #3e6d4a;
  }
`;

const TransactionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  &.active {
    color: #3e6d4a;
  }
  
  &.overdue {
    color: #3e6d4a;
  }
  
  &.completed {
    color: #3e6d4a;
  }
  
  &.pending {
    color: #f57c00;
  }
`;

const TransactionAmount = styled.div`
  font-weight: 600;
    color: #8192c;
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const TransactionDate = styled.div`
  color: #8192c;
  font-size: 0.9rem;
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #8192c;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #8192c;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: #f7d7a8;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #8192c;
  margin-bottom: 2rem;
`;

const BrowseButton = styled.button`
  background: linear-gradient(135deg, #294328 0%, #c96e34 100%);
  color: #f7d7a8;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #294328;
  color: #f7d7a8;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
  margin-left: 0.75rem;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const UserTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:5000/api/transactions/my`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn('Failed to fetch transactions:', data?.message);
        setTransactions([]);
      } else {
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      }
    } catch (e) {
      console.error('Transactions fetch error:', e);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleReturn = async (transaction) => {
    try {
      if (!transaction?.book?._id) return;
      setProcessingId(transaction._id);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/books/${transaction.book._id}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || 'Failed to return book');
        return;
      }
      alert('Book returned successfully');
      fetchTransactions();
    } catch (e) {
      console.error('Return error:', e);
      alert('Failed to return book. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <FaClock />;
      case 'overdue':
        return <FaExclamationTriangle />;
      case 'completed':
        return <FaCheckCircle />;
      case 'pending':
        return <FaClock />;
      default:
        return <FaClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#2e7d32';
      case 'overdue':
        return '#d32f2f';
      case 'completed':
        return '#666';
      case 'pending':
        return '#f57c00';
      default:
        return '#666';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'borrow':
        return '#1976d2';
      case 'purchase':
        return '#2e7d32';
      case 'return':
        return '#f57c00';
      default:
        return '#666';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'active') return transaction.status === 'active';
    if (filter === 'overdue') return transaction.status === 'overdue';
    if (filter === 'completed') return transaction.status === 'completed';
    if (filter === 'borrow') return transaction.type === 'borrow';
    if (filter === 'purchase') return transaction.type === 'purchase';
    return true;
  });

  const stats = {
    total: transactions.length,
    active: transactions.filter(t => t.status === 'active').length,
    overdue: transactions.filter(t => t.status === 'overdue').length,
    completed: transactions.filter(t => t.status === 'completed').length
  };

  if (loading) {
    return (
      <TransactionsContainer>
        <TransactionsContent>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div>Loading transactions...</div>
          </div>
        </TransactionsContent>
      </TransactionsContainer>
    );
  }

  return (
    <TransactionsContainer>
      <TransactionsContent>
        <PageHeader>
          <PageTitle>My Transactions</PageTitle>
          <PageSubtitle>Track your borrowing and purchase history</PageSubtitle>
        </PageHeader>

        <StatsGrid>
          <StatCard color="#8192c">
            <StatNumber color="#8192c">{stats.total}</StatNumber>
            <StatLabel>Total Transactions</StatLabel>
          </StatCard>
          <StatCard color="#2e7d32">
            <StatNumber color="#8192c">{stats.active}</StatNumber>
            <StatLabel>Active Borrows</StatLabel>
          </StatCard>
          <StatCard color="#c96e34">
            <StatNumber color="#c96e34">{stats.overdue}</StatNumber>
            <StatLabel>Overdue</StatLabel>
          </StatCard>
          <StatCard color="#8192c">
            <StatNumber color="#8192c">{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </StatCard>
        </StatsGrid>

        <FilterSection>
          <FilterTitle>Filter Transactions</FilterTitle>
          <FilterOptions>
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={filter === 'active'} 
              onClick={() => setFilter('active')}
            >
              Active
            </FilterButton>
            <FilterButton 
              active={filter === 'overdue'} 
              onClick={() => setFilter('overdue')}
            >
              Overdue
            </FilterButton>
            <FilterButton 
              active={filter === 'completed'} 
              onClick={() => setFilter('completed')}
            >
              Completed
            </FilterButton>
            <FilterButton 
              active={filter === 'borrow'} 
              onClick={() => setFilter('borrow')}
            >
              Borrows
            </FilterButton>
            <FilterButton 
              active={filter === 'purchase'} 
              onClick={() => setFilter('purchase')}
            >
              Purchases
            </FilterButton>
          </FilterOptions>
        </FilterSection>

        {filteredTransactions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FaBook />
            </EmptyIcon>
            <EmptyTitle>No transactions found</EmptyTitle>
            <EmptyText>
              {filter === 'all' 
                ? "You haven't made any transactions yet. Start exploring our library!"
                : `No ${filter} transactions found.`
              }
            </EmptyText>
            {filter === 'all' && (
              <BrowseButton to="/books" >Browse Books</BrowseButton>
            )}
          </EmptyState>
        ) : (
          <TransactionsList>
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction._id}>
                <TransactionInfo>
                  <BookIcon>
                    <FaBook />
                  </BookIcon>
                  <BookDetails>
                    <BookTitle>{transaction.book?.title || 'Unknown Title'}</BookTitle>
                    <BookAuthor>{transaction.book?.author || ''}</BookAuthor>
                  </BookDetails>
                </TransactionInfo>
                
                <TransactionType className={transaction.type}>
                  {transaction.type === 'borrow' ? 'Borrowed' : 
                   transaction.type === 'purchase' ? 'Purchased' : 
                   transaction.type === 'return' ? 'Returned' : transaction.type}
                </TransactionType>
                
                <TransactionStatus 
                  className={transaction.status}
                  style={{ color: getStatusColor(transaction.status) }}
                >
                  {getStatusIcon(transaction.status)}
                  {transaction.status === 'active' && (transaction.dueDate || transaction.returnDate) && (
                    <span>Due: {new Date(transaction.dueDate || transaction.returnDate).toLocaleDateString()}</span>
                  )}
                  {transaction.status === 'overdue' && (
                    <span>Overdue (₹{transaction.fine || 0} fine)</span>
                  )}
                  {transaction.status === 'completed' && (
                    <span>Completed</span>
                  )}
                  {transaction.status === 'pending' && (
                    <span>Pending</span>
                  )}
                </TransactionStatus>
                
                <div>
                  <TransactionAmount>
                    {transaction.type === 'purchase' ? `₹${transaction.book?.price ?? 0}` : 'Free'}
                  </TransactionAmount>
                  <TransactionDate>
                    {new Date(transaction.borrowDate || transaction.purchaseDate || transaction.createdAt).toLocaleDateString()}
                  </TransactionDate>
                  {transaction.type === 'borrow' && transaction.status === 'active' && (
                    <ActionButton onClick={() => handleReturn(transaction)} disabled={processingId === transaction._id}>
                      {processingId === transaction._id ? 'Returning...' : 'Return'}
                    </ActionButton>
                  )}
                </div>
              </TransactionItem>
            ))}
          </TransactionsList>
        )}
      </TransactionsContent>
    </TransactionsContainer>
  );
};

export default UserTransactions;
