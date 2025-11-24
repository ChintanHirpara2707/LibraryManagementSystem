import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';
import { gsap } from 'gsap';
import AddBookModal from '../../components/admin/AddBookModal';
import EditBookModal from '../../components/admin/EditBookModal';

const BookManagementContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 2rem 0;
`;

const BookManagementContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E0E0E0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  color: #333333;
  margin: 0;
  font-weight: 500;
`;

const AddBookButton = styled.button`
  background: #3e6d4a;
  color: #FFFFFF;
  border: 1px solid #3e6d4a;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #2c5036;
    color: #FFFFFF;
    border-color: #2c5036;
    transform: translateY(-2px);
  }
`;

const SearchAndFilterSection = styled.div`
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid #E0E0E0;
  margin-bottom: 2rem;
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack for mobile */
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 10px;
  font-size: 1rem;
  color: #333333;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #333333;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
  }

  &::placeholder {
    color: #999999;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 10px;
  font-size: 1rem;
  color: #333333;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #333333;
  }

  option {
    background: #FFFFFF;
    color: #333333;
  }
    outline: none;
  border-color: #333333;
  }
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #3e6d4a;
  border: 1px solid #3e6d4a;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: #3e6d4a;
    color: #FFFFFF;
    border-color: #3e6d4a;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f3f3f3;
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid #3e6d4a;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${props => props.color || '#2c5036'};
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3e6d4a;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #3e6d4a;
  font-size: 0.9rem;
  font-weight: 500;
`;

const BooksTable = styled.div`
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #E0E0E0;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  background: #F5F5F5;
  font-weight: 600;
  color: #3e6d4a;
  border-bottom: 1px solid #2c5036;
  
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
  color: #f7d7a8;
  transition: background-color 0.3s ease, transform 0.2s ease;
  
  &:hover {
    background: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9f9f9;
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
  }
`;

const BookInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BookIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #294328;
  border: 1px solid #81927c;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: #3e6d4a;
    color: #111a19;
    border-color: #2c5036;
  }
`;

const Thumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #81927c;
`;

const BookDetails = styled.div`
  flex: 1;
`;

const BookTitle = styled.div`
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.25rem;
`;

const BookAuthor = styled.div`
  color: #333333;
  font-size: 0.9rem;
`;

const BookCategory = styled.div`
  color: #333333;
  font-size: 0.9rem;
`;

const BookPrice = styled.div`
  font-weight: 600;
  color: #333333;
`;

const BookQuantity = styled.div`
  text-align: center;
  
  .available {
    color: #333333;
    font-weight: 600;
  }
  
  .low {
    color: #c96e34;
    font-weight: 600;
  }
  
  .out {
    color: #d32f2f;
    font-weight: 600;
  }
`;

const BookStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(17, 26, 25, 0.7);
  border: 1px solid #81927c;
  text-align: center;
  
  &.available {
    background: rgba(41, 67, 40, 0.95);
    color: #ffffff;
    border-color: #3e6d4a;
  }
  
  &.unavailable {
    background: rgba(201, 110, 52, 0.2);
    color: #c96e34;
    border-color: #c96e34;
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
  border: 1px solid #3e6d4a;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3e6d4a;
  
  &.edit {
    color: #2c5036;
    
    &:hover {
      background: #2c5036;
      color: #ffffff;
      border-color: #3e6d4a;
    }
  }
  
  &.delete {
    color: #ffffff;
    
    &:hover {
      background: #2c5036;
      color: #ffffff;
      border-color: #3e6d4a;
    }
  }
  
  &.view {
    color: #ffffff;
    
    &:hover {
      background: #2c5036;
      color: #ffffff;
      border-color: #3e6d4a;
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
  border: 1px solid #81927c;
  background: ${props => props.active ? '#294328' : 'rgba(17, 26, 25, 0.7)'};
  color: #2c5036;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3e6d4a;
    background: ${props => props.active ? '#294328' : '#81927c'};
    color: ${props => props.active ? '#f7d7a8' : '#111a19'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(17, 26, 25, 0.3);
    border-color: #81927c;
    color: #81927c;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #81927c;
  background: rgba(41, 67, 40, 0.95);
  border-radius: 15px;
  border: 1px solid #81927c;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #81927c;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: #f7d7a8;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const EmptyText = styled.p`
  color: #81927c;
  margin-bottom: 2rem;
`;

const BookManagement = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const statsRef = useRef([]);
  statsRef.current = [];
  const rowsRef = useRef([]);
  rowsRef.current = [];

  const addToStatsRef = (el) => {
    if (el && !statsRef.current.includes(el)) statsRef.current.push(el);
  };
  const addToRowsRef = (el) => {
    if (el && !rowsRef.current.includes(el)) rowsRef.current.push(el);
  };

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/books', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from(statsRef.current, { autoAlpha: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
        gsap.from(rowsRef.current, { autoAlpha: 0, y: 20, duration: 0.5, stagger: 0.04, ease: 'power2.out' });
      });
      return () => ctx.revert();
    }
  }, [loading]);

  const getQuantityStatus = (available, total) => {
    if (available === 0) return 'out';
    if (available <= total * 0.2) return 'low';
    return 'available';
  };

  const getQuantityText = (available, total) => {
    const status = getQuantityStatus(available, total);
    return (
      <span className={status}>
        {available} / {total}
      </span>
    );
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleEdit = (bookId) => {
    console.log('Edit book:', bookId);
    // Implement edit functionality - could open a modal or navigate to edit page
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Book deleted successfully!');
          fetchBooks(); // Refresh the book list
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete book');
        }
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const handleView = (bookId) => {
    console.log('View book:', bookId);
  };

  const handleOpenEdit = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const updateBook = async (bookId, updates) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update book');
    }
    await fetchBooks();
  };

  const handleAddBook = () => {
    setShowAddModal(true);
  };

  const addBook = async (bookData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Book data being sent:', bookData);
      
      // Check if user is admin
      if (!user || user.role !== 'admin') {
        throw new Error('Only admins can add books');
      }
      
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        alert('Book added successfully!');
        fetchBooks(); // Refresh the book list
      } else {
        // Show detailed error message
        if (data.errors && data.errors.length > 0) {
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        }
        throw new Error(data.message || 'Failed to add book');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const stats = {
    total: books.length,
    available: books.filter(b => b.isAvailable).length,
    unavailable: books.filter(b => !b.isAvailable).length,
    lowStock: books.filter(b => getQuantityStatus(b.availableQuantity, b.quantity) === 'low').length
  };

  if (loading) {
    return (
      <BookManagementContainer>
        <BookManagementContent>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div>Loading books...</div>
          </div>
        </BookManagementContent>
      </BookManagementContainer>
    );
  }

  return (
    <BookManagementContainer>
      <BookManagementContent>
        <PageHeader>
          <PageTitle>Book Management</PageTitle>
          <AddBookButton onClick={handleAddBook}>
            <FaPlus />
            Add New Book
          </AddBookButton>
        </PageHeader>

        <StatsGrid>
          <StatCard ref={addToStatsRef}>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Books</StatLabel>
          </StatCard>
          <StatCard ref={addToStatsRef}>
            <StatNumber>{stats.available}</StatNumber>
            <StatLabel>Available</StatLabel>
          </StatCard>
          <StatCard ref={addToStatsRef}>
            <StatNumber>{stats.unavailable}</StatNumber>
            <StatLabel>Unavailable</StatLabel>
          </StatCard>
          <StatCard ref={addToStatsRef}>
            <StatNumber>{stats.lowStock}</StatNumber>
            <StatLabel>Low Stock</StatLabel>
          </StatCard>
        </StatsGrid>

        <SearchAndFilterSection>
          <SearchRow>
            <SearchInput
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Classic">Classic</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </FilterSelect>
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </FilterSelect>
            <FilterButton onClick={() => {
            setSearchTerm('');
            setCategoryFilter('all');
            setStatusFilter('all');
          }}>
            Clear Filters
          </FilterButton>
          </SearchRow>
        </SearchAndFilterSection>

        {filteredBooks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FaBook />
            </EmptyIcon>
            <EmptyTitle>No books found</EmptyTitle>
            <EmptyText>
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No books in the library yet. Add your first book!'
              }
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <BooksTable>
              <TableHeader>
                <div>Book</div>
                <div>Category</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Status</div>
                <div>Actions</div>
              </TableHeader>
              
              {currentBooks.map((book) => (
                <TableRow key={book._id} ref={addToRowsRef}>
                  <BookInfo>
                    {book.coverImage ? (
                      <Thumbnail src={book.coverImage} alt={book.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <BookIcon>
                        <FaBook />
                      </BookIcon>
                    )}
                    <BookDetails>
                      <BookTitle>{book.title}</BookTitle>
                      <BookAuthor>{book.author}</BookAuthor>
                    </BookDetails>
                  </BookInfo>
                  
                  <BookCategory>{book.category}</BookCategory>
                  
                  <BookPrice>₹{book.price}</BookPrice>
                  
                  <BookQuantity>
                    {getQuantityText(book.availableQuantity, book.quantity)}
                  </BookQuantity>
                  
                  <BookStatus className={book.isAvailable ? 'available' : 'unavailable'}>
                    {book.isAvailable ? 'Available' : 'Unavailable'}
                  </BookStatus>
                  
                  <ActionButtons>
                    <ActionButton className="view" onClick={() => handleView(book._id)}>
                      <FaEye />
                    </ActionButton>
                    <ActionButton className="edit" onClick={() => handleOpenEdit(book)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton className="delete" onClick={() => handleDelete(book._id)}>
                      <FaTrash />
                    </ActionButton>
                  </ActionButtons>
                </TableRow>
              ))}
            </BooksTable>

            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </PageButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PageButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PageButton>
                ))}
                
                <PageButton
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        )}
      </BookManagementContent>
      
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddBook={addBook}
      />
      <EditBookModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        book={selectedBook}
        onUpdate={updateBook}
      />
    </BookManagementContainer>
  );
};

export default BookManagement;
