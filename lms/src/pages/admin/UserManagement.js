import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSearch, FaEdit, FaTrash, FaEye, FaUserCheck, FaUserTimes, FaEnvelope } from 'react-icons/fa';
import styled from 'styled-components';

const UserManagementContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 2rem 0;
`;

const UserManagementContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between; /* title left, button right */
  align-items: center;
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

const AddUserButton = styled.button`
  background: #3e6d4a;
  color: #FFFFFF;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    background: #2c5036;
  }
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

const UsersTable = styled.div`
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  border: 1px solid #E0E0E0;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.9fr 0.7fr 1fr 0.4fr auto;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
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


const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: #F5F5F5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 1.5rem;
  font-weight: 600;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  color: #666666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserMembership = styled.div`
  color: #666666;
  font-size: 0.9rem;
  font-weight: 500;
`;

const UserRole = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  
  &.admin {
    background: #fff3e0;
    color: #f57c00;
  }
  
  &.user {
    background: #e3f2fd;
    color: #1976d2;
  }
`;

const UserStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  
  &.active {
    background: #d4edda;
    color: #155724;
  }
  
  &.inactive {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.suspended {
    background: #fff3cd;
    color: #856404;
  }
`;

const UserJoinDate = styled.div`
  color: #ffffff;
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
  
  &.edit {
    background: #f3e5f5;
    color: #1976d2;
    
    &:hover {
      background: #f3e5f5;
    }
  }
  
  &.delete {
        background: #f3e5f5;
    color: #d32f2f;
    
    &:hover {
      background: #f3e5f5;
    }
  }
  
  &.view {
    background: #f3e5f5;
    color: #7b1fa2;
    
    &:hover {
      background: #f3e5f5;
    }
  }
  
  &.status {
    background: #f3e5f5;
    color: #2e7d32;
    
    &:hover {
      background: #f3e5f5;
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
  border: 1px solid #E0E0E0;
  background: ${props => props.active ? '#3e6d4a' : '#FFFFFF'};
  color: ${props => props.active ? '#FFFFFF' : '#333333'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #CCCCCC;
    background: ${props => props.active ? '#2c5036' : '#F5F5F5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #f7d7a8;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #f7d7a8;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: #f7d7a8;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #f7d7a8;
  margin-bottom: 2rem;
`;

// Modal styles
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #111a19;
  border: 1px solid #81927c;
  border-radius: 12px;
  width: 95%;
  max-width: 520px;
  padding: 1.25rem;
`;

const ModalTitle = styled.h3`
  color: #f7d7a8;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  position: relative;
  width: 100%;
`;

const FormControl = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
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

const FormSelect = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  background: rgba(129, 146, 124, 0.1);
  border: 1px solid #294328;
  border-radius: 8px;
  font-size: 1rem;
  color: #f7d7a8;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #c96e34;
    background: rgba(129, 146, 124, 0.15);
  }

  option {
    background: #111a19;
    color: #f7d7a8;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* stack on mobile */
  }
`;



const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 2px solid #81927c;
  background: #111a19;
  color: #f7d7a8;
  cursor: pointer;
  transition: 0.2s;
  &:hover { border-color: #c96e34; }
  &.primary { background: #c96e34; color: #fff; border-color: #c96e34; }
`;

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Map API user to UI model
  const mapApiUser = (u) => ({
    id: u._id || u.id,
    username: u.username,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    status: u.status || (u.isActive === false ? 'inactive' : 'active'),
    membershipId: u.membershipId,
    joinDate: u.createdAt,
    phone: u.phone,
    lastLogin: u.lastLogin
  });

  // Fetch users from backend
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await axios.get('/api/users', { params });
      const apiUsers = (res.data.users || []).map(mapApiUser);
      setUsers(apiUsers);
      const pagination = res.data.pagination || {};
      setCurrentPage(pagination.currentPage || page);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
      setUsers([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchUsers(1);
  };

  const handleEdit = (userId) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    setEditingUser({ ...u });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success('User deleted');
      fetchUsers(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleView = (userId) => {
    const u = users.find(x => x.id === userId);
    if (u) toast.info(`${u.firstName} ${u.lastName} (${u.email})`);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const next = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.put(`/api/users/${userId}/status`, { status: next });
      toast.success('Status updated');
      fetchUsers(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  return (
    <UserManagementContainer>
      <UserManagementContent>
        <PageHeader>
          <PageTitle>User Management</PageTitle>
          <AddUserButton onClick={() => setShowAddModal(true)}>
            <FaUser />
            Add New User
          </AddUserButton>
        </PageHeader>

        <StatsGrid>
          <StatCard color="#c96e34">
            <StatNumber color="#c96e34">{stats.total}</StatNumber>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard color="#c96e34">
            <StatNumber color="#c96e34">{stats.active}</StatNumber>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
          <StatCard color="#c96e34">
            <StatNumber color="#c96e34">{stats.suspended}</StatNumber>
            <StatLabel>Suspended</StatLabel>
          </StatCard>
          <StatCard color="#c96e34">
            <StatNumber color="#c96e34">{stats.admins}</StatNumber>
            <StatLabel>Administrators</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <SearchAndFilterSection>
          <SearchRow>
            <SearchInput
              type="text"
              placeholder="Search by username, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </FilterSelect>
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </FilterSelect>
            <FilterButton onClick={handleApplyFilters}>Apply</FilterButton>
            <FilterButton onClick={() => { setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); fetchUsers(1); }}>Clear</FilterButton>
          </SearchRow>
        </SearchAndFilterSection>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div>Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FaUser />
            </EmptyIcon>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyText>
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No users in the system yet. Add your first user!'}
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <UsersTable>
              <TableHeader>
                <div>User</div>
                <div>Role</div>
                <div>Status</div>
                <div>Join Date</div>
                <div>Actions</div>
              </TableHeader>
              
              {users.map((user) => (
                <TableRow key={user.id}>
                  <UserInfo>
                    <UserAvatar>
                      {getInitials(user.firstName, user.lastName)}
                    </UserAvatar>
                    <UserDetails>
                      <UserName>{user.firstName} {user.lastName}</UserName>
                      <UserEmail>
                        <FaEnvelope />
                        {user.email}
                      </UserEmail>
                      <UserMembership>ID: {user.membershipId}</UserMembership>
                    </UserDetails>
                  </UserInfo>
                  
                  <UserRole className={user.role}>
                    {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </UserRole>
                  
                  <UserStatus className={user.status}>
                    {user.status === 'active' ? 'Active' : 
                     user.status === 'inactive' ? 'Inactive' : 'Suspended'}
                  </UserStatus>
                  
                  <UserJoinDate>
                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '-'}
                  </UserJoinDate>
                  
                  <ActionButtons>
                    <ActionButton className="view" onClick={() => handleView(user.id)}>
                      <FaEye />
                    </ActionButton>
                    <ActionButton className="edit" onClick={() => handleEdit(user.id)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton 
                      className="status" 
                      onClick={() => handleStatusToggle(user.id, user.status)}
                    >
                      {user.status === 'active' ? <FaUserTimes /> : <FaUserCheck />}
                    </ActionButton>
                    <ActionButton className="delete" onClick={() => handleDelete(user.id)}>
                      <FaTrash />
                    </ActionButton>
                  </ActionButtons>
                </TableRow>
              ))}
            </UsersTable>

            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  disabled={currentPage === 1}
                  onClick={() => fetchUsers(currentPage - 1)}
                >
                  Previous
                </PageButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PageButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => fetchUsers(page)}
                  >
                    {page}
                  </PageButton>
                ))}
                
                <PageButton
                  disabled={currentPage === totalPages}
                  onClick={() => fetchUsers(currentPage + 1)}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        )}

        {(showAddModal || editingUser) && (
          <ModalBackdrop onClick={() => { setShowAddModal(false); setEditingUser(null); }}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>{editingUser ? 'Edit User' : 'Add User'}</ModalTitle>
              <UserForm
                initial={editingUser}
                onCancel={() => { setShowAddModal(false); setEditingUser(null); }}
                onSubmit={async (values) => {
                  try {
                    if (editingUser) {
                      await axios.put(`/api/users/${editingUser.id}`, values);
                      toast.success('User updated');
                    } else {
                      await axios.post('/api/users', values);
                      toast.success('User created');
                    }
                    setShowAddModal(false);
                    setEditingUser(null);
                    fetchUsers(currentPage);
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Save failed');
                  }
                }}
              />
            </ModalContent>
          </ModalBackdrop>
        )}
      </UserManagementContent>
    </UserManagementContainer>
  );
};

export default UserManagement;

// Lightweight in-file form component to keep page self-contained
const UserForm = ({ initial, onCancel, onSubmit }) => {
  const [form, setForm] = useState({
    username: initial?.username || '',
    email: initial?.email || '',
    firstName: initial?.firstName || '',
    lastName: initial?.lastName || '',
    phone: initial?.phone || '',
    role: initial?.role || 'user',
    status: initial?.status || 'active',
    password: ''
  });

  const isEdit = !!initial;

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (isEdit) delete payload.password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit}>
      <FormRow>
        <FormControl placeholder="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
        <FormControl placeholder="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
      </FormRow>
      <FormRow>
        <FormControl placeholder="Username" value={form.username} onChange={(e) => update('username', e.target.value)} disabled={isEdit} />
        <FormControl placeholder="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} disabled={isEdit} />
      </FormRow>
      {!isEdit && (
        <FormRow>
          <FormControl placeholder="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} />
          <FormControl placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </FormRow>
      )}
      {isEdit && (
        <FormRow>
          <FormControl placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          <div />
        </FormRow>
      )}
      <FormRow>
        <FormSelect value={form.role} onChange={(e) => update('role', e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </FormSelect>
        <FormSelect value={form.status} onChange={(e) => update('status', e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </FormSelect>
      </FormRow>
      <ModalActions>
        <Button type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="primary">Save</Button>
      </ModalActions>
    </form>
  );
};
