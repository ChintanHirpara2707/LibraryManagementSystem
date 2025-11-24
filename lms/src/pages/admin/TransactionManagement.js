import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaUser, FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaClock, FaDollarSign } from 'react-icons/fa';
import styled from 'styled-components';

const TransactionManagementContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 2rem 0;
`;

const TransactionManagementContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E0E0E0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #333333;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  color: #666666;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
  border-left: 4px solid ${props => props.color};
  border: 1px solid #E0E0E0;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666666;
  font-size: 0.9rem;
  font-weight: 500;
`;

const SearchAndFilterSection = styled.div`
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  border: 1px solid #E0E0E0;
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto auto; /* 5 columns */
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack for mobile */
  }
`;


const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  background: #FFFFFF;
  color: #333333;
  
  &::placeholder {
    color: #999999;
  }
  
  &:focus {
    outline: none;
    border-color: #333333;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  background: #FFFFFF;
  color: #333333;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #333333;
  }
    option {
    background: #FFFFFF;
    color: #333333;
  }
`;

const FilterButton = styled.button`
  background: transparent;
  color: #3e6d4a;
  border: 1px solid #3e6d4a;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: #3e6d4a;
    color: #FFFFFF;
  }
`;

const TransactionsTable = styled.div`
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  border: 1px solid #E0E0E0;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  background: #F5F5F5;
  font-weight: 600;
  color: #333333;
  border-bottom: 1px solid #E0E0E0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #E0E0E0;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #F9F9F9;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #F5F5F5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 1.2rem;
`;

const TransactionDetails = styled.div`
  flex: 1;
`;

const BookTitle = styled.div`
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.25rem;
`;

const UserName = styled.div`
  color:rgb(0, 0, 0);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TransactionType = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  
  &.borrow {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  &.purchase {
    background: #e8f5e8;
    color: #2e7d32;
  }
  
  &.return {
    background: #fff3e0;
    color: #f57c00;
  }
`;

const TransactionStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  
  &.active {
    background: #d4edda;
    color: #155724;
  }
  
  &.overdue {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.completed {
    background: #e8f5e8;
    color: #2e7d32;
  }
  
  &.pending {
    background: #fff3cd;
    color: #856404;
  }
`;

const TransactionAmount = styled.div`
  font-weight: 600;
  color: #333333;
  text-align: center;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const TransactionDate = styled.div`
  color:rgb(2, 2, 2);
  font-size: 0.9rem;
  text-align: center;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 1rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.view {
    background: #f3e5f5;
    color: #7b1fa2;
    
    &:hover {
      background: #e1bee7;
    }
  }
  
  &.process {
    background: #e8f5e8;
    color: #2e7d32;
    
    &:hover {
      background: #c8e6c9;
    }
  }
  
  &.overdue {
    background: #fff3cd;
    color: #856404;
    
    &:hover {
      background: #ffeaa7;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #8192c;
  background: ${props => props.active ? '#2e7d32' : '#ffffffff'};
  color: ${props => props.active ? 'white' : '#8192c'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8192c;
    background: ${props => props.active ? '#50a854ff' : '#ffffffff'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const TransactionManagement = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mapApiTx = (t) => ({
    id: t._id || t.id,
    book: {
      title: t.book?.title || '-',
      author: t.book?.author || '-'
    },
    user: {
      name: t.user ? `${t.user.firstName} ${t.user.lastName}`.trim() : '-',
      email: t.user?.email || '-'
    },
    type: t.type,
    status: t.status,
    amount: t.amount || 0,
    date: t.createdAt,
    dueDate: t.dueDate,
    returnDate: t.returnDate,
    fine: t.fine || 0
  });

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (typeFilter !== 'all') params.type = typeFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await axios.get('/api/transactions', { params });
      const apiTxs = (res.data.transactions || []).map(mapApiTx);
      setTransactions(apiTxs);
      const pagination = res.data.pagination || {};
      setCurrentPage(pagination.currentPage || page);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load transactions');
      setTransactions([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    // Server filters handle type/status; client-side search for current page
    const matchesSearch = transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApplyFilters = () => {
    fetchTransactions(1);
  };

  const handleView = (transactionId) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (tx) toast.info(`${tx.book.title} • ${tx.user.name} • ${tx.status}`);
  };

  const handleProcessReturn = async (transactionId) => {
    try {
      await axios.post(`/api/transactions/${transactionId}/process-return`);
      toast.success('Return processed');
      fetchTransactions(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process return');
    }
  };

  const handleOverdueAction = async (transactionId) => {
    try {
      await axios.put(`/api/transactions/${transactionId}/status`, { status: 'overdue' });
      toast.success('Marked as overdue');
      fetchTransactions(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const stats = {
    total: transactions.length,
    active: transactions.filter(t => t.status === 'active').length,
    overdue: transactions.filter(t => t.status === 'overdue').length,
    completed: transactions.filter(t => t.status === 'completed').length,
    borrows: transactions.filter(t => t.type === 'borrow').length,
    purchases: transactions.filter(t => t.type === 'purchase').length
  };

  return (
    <TransactionManagementContainer>
      <TransactionManagementContent>
        <PageHeader>
          <PageTitle>Transaction Management</PageTitle>
          <PageSubtitle>Monitor and manage all library transactions</PageSubtitle>
        </PageHeader>

        <StatsGrid>
          <StatCard color="#667eea">
            <StatNumber color="#667eea">{stats.total}</StatNumber>
            <StatLabel>Total Transactions</StatLabel>
          </StatCard>
          <StatCard color="#2e7d32">
            <StatNumber color="#2e7d32">{stats.active}</StatNumber>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard color="#c96e34">
            <StatNumber color="#c96e34">{stats.overdue}</StatNumber>
            <StatLabel>Overdue</StatLabel>
          </StatCard>
          <StatCard color="#ffffff">
            <StatNumber color="#ffffff">{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </StatCard>
        </StatsGrid>

        <SearchAndFilterSection>
          <SearchRow>
            <SearchInput
              type="text"
              placeholder="Search by book title, user name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="borrow">Borrow</option>
              <option value="purchase">Purchase</option>
              <option value="return">Return</option>
            </FilterSelect>
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </FilterSelect>
            <FilterButton onClick={handleApplyFilters}>Apply</FilterButton>
            <FilterButton onClick={() => { setSearchTerm(''); setTypeFilter('all'); setStatusFilter('all'); fetchTransactions(1); }}>Clear</FilterButton>
          </SearchRow>
        </SearchAndFilterSection>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div>Loading transactions...</div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FaBook />
            </EmptyIcon>
            <EmptyTitle>No transactions found</EmptyTitle>
            <EmptyText>
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No transactions in the system yet.'
              }
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <TransactionsTable>
              <TableHeader>
                <div>Transaction</div>
                <div>Type</div>
                <div>Status</div>
                <div>Amount</div>
                <div>Date</div>
                <div>Actions</div>
              </TableHeader>
              
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TransactionInfo>
                    <BookIcon>
                      <FaBook />
                    </BookIcon>
                    <TransactionDetails>
                      <BookTitle>{transaction.book.title}</BookTitle>
                      <UserName style={{ fontSize: '0.8rem', color: '#000000' }}> 
                        <FaUser />
                        {transaction.user.name}
                      </UserName>
                    </TransactionDetails>
                  </TransactionInfo>
                  
                  <TransactionType className={transaction.type}>
                    {transaction.type === 'borrow' ? 'Borrowed' : 
                     transaction.type === 'purchase' ? 'Purchased' : 'Returned'}
                  </TransactionType>
                  
                  <TransactionStatus className={transaction.status}>
                    {transaction.status === 'active' ? 'Active' : 
                     transaction.status === 'overdue' ? 'Overdue' : 
                     transaction.status === 'completed' ? 'Completed' : 'Pending'}
                  </TransactionStatus>
                  
                  <TransactionAmount>
                    {transaction.amount > 0 ? `${transaction.amount}` : 'Free'}
                    {transaction.fine > 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#c96e34' }}>
                        Fine: ₹{transaction.fine}
                      </div>
                    )}
                  </TransactionAmount>
                  
                  <TransactionDate>
                    <div style={{ fontSize: '0.8rem', color: '#000000' }}>{new Date(transaction.date).toLocaleDateString()}</div>
                    {transaction.dueDate && (
                      <div style={{ fontSize: '0.8rem', color: '#000000' }}>
                        Due: {new Date(transaction.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </TransactionDate>
                  
                  <ActionButtons>
                    <ActionButton className="view" onClick={() => handleView(transaction.id)}>
                      <FaEye />
                    </ActionButton>
                    {transaction.status === 'active' && (
                      <ActionButton className="process" onClick={() => handleProcessReturn(transaction.id)}>
                        <FaCheckCircle />
                      </ActionButton>
                    )}
                    {transaction.status === 'overdue' && (
                      <ActionButton className="overdue" onClick={() => handleOverdueAction(transaction.id)}>
                        <FaExclamationTriangle />
                      </ActionButton>
                    )}
                  </ActionButtons>
                </TableRow>
              ))}
            </TransactionsTable>

            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  disabled={currentPage === 1}
                  onClick={() => fetchTransactions(currentPage - 1)}
                >
                  Previous
                </PageButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PageButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => fetchTransactions(page)}
                  >
                    {page}
                  </PageButton>
                ))}
                
                <PageButton
                  disabled={currentPage === totalPages}
                  onClick={() => fetchTransactions(currentPage + 1)}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        )}
      </TransactionManagementContent>
    </TransactionManagementContainer>
  );
};

export default TransactionManagement;
