import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaBook, FaEye, FaShoppingCart, FaClock } from 'react-icons/fa';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const CatalogContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 2rem 0;
`;

const CatalogContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const CatalogHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const CatalogTitle = styled.h1`
  font-size: 2.5rem;
  color: #333333;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const CatalogSubtitle = styled.p`
  color: #666666;
  font-size: 1.1rem;
`;

const SearchSection = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  border: 1px solid #E0E0E0;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
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

const SearchButton = styled.button`
  background: #3e6d4a;
  color: #FFFFFF;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: #2c5036;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
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

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const BookCard = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 32px rgba(0,0,0,0.18);
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 6px;
    background: linear-gradient(to bottom, #d8c7a3, #b89c72);
    border-radius: 15px;
  }
`;

const BookImage = styled.div`
  height: 220px;
  background: linear-gradient(135deg, #fafafa 0%, #eaeaea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #ddd;

  &::after {
    content: "📖";
    font-size: 5rem;
    opacity: 0.08;
    position: absolute;
    bottom: -10px;
    right: -10px;
    transform: rotate(-20deg);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TitlePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
`;

const TitleCard = styled.div`
  background: #fffefc;
  border: 1px solid #e5e3df;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6),
              0 3px 10px rgba(0,0,0,0.08);
  transition: all 0.25s ease;
  text-align: center;
  max-width: 85%;

  ${BookImage}:hover & {
    transform: scale(1.04);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
`;

const TitleText = styled.div`
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
  color: #2c2c2c;
  text-shadow: 0 1px 0 rgba(255,255,255,0.6);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const BookContent = styled.div`
  padding: 1.25rem 1rem;
  background: #fff;
`;

const BookTitle = styled.h3`
  font-size: 1.1rem;
  color: #1f1f1f;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const BookAuthor = styled.p`
  color: #5f5f5f;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const BookCategory = styled.span`
  background: #f2ede6;
  color: #5b4636;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: inline-block;
`;

const BookPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 1rem;
`;

const BookActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;

  &.primary {
    background: #3e6d4a;
    color: #fff;

    &:hover {
      background: #2c5036;
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: transparent;
    border: 1.5px solid #3e6d4a;
    color: #3e6d4a;

    &:hover {
      background: #3e6d4a;
      color: #fff;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  background: white;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2c5036;
    color: #3e6d4a;
  }
  
  &.active {
    background: #f7d7a8;
    color: white;
    border-color: #f7d7a8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const BookCatalog = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Self-Help', 'Business', 'Literature', 'Children', 'Other'];
  const formats = ['Hardcover', 'Paperback', 'E-Book', 'Audiobook'];

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedFormat && { format: selectedFormat })
      });

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(`http://localhost:5000/api/books?${params}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
      setTotalBooks(data.total || 0);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm, selectedCategory, selectedFormat]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchBooks();
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filtering
    fetchBooks();
  };

  // Handle borrow functionality
  const handleBorrow = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to borrow books');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/books/${bookId}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Book borrowed successfully!');
        fetchBooks(); // Refresh the book list
      } else {
        alert(data.message || 'Failed to borrow book');
      }
    } catch (err) {
      console.error('Error borrowing book:', err);
      alert('Failed to borrow book. Please try again.');
    }
  };

  // Handle purchase functionality
  const handlePurchase = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to purchase books');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/books/${bookId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Book purchased successfully!');
        fetchBooks(); // Refresh the book list
      } else {
        alert(data.message || 'Failed to purchase book');
      }
    } catch (err) {
      console.error('Error purchasing book:', err);
      alert('Failed to purchase book. Please try again.');
    }
  };

  if (loading) {
    return (
      <CatalogContainer>
        <CatalogContent>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div>Loading books...</div>
          </div>
        </CatalogContent>
      </CatalogContainer>
    );
  }

  if (error) {
    return (
      <CatalogContainer>
        <CatalogContent>
          <div style={{ textAlign: 'center', padding: '4rem', color: '#d32f2f' }}>
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={fetchBooks} style={{ 
              padding: '0.5rem 1rem', 
              background: '#c96e34', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}>
              Try Again
            </button>
          </div>
        </CatalogContent>
      </CatalogContainer>
    );
  }

  return (
    <CatalogContainer>
      <CatalogContent>
        <CatalogHeader>
          <CatalogTitle>Book Catalog</CatalogTitle>
          <CatalogSubtitle>Discover your next favorite book ({totalBooks} books available)</CatalogSubtitle>
        </CatalogHeader>

        <SearchSection>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="submit">
              <FaSearch style={{ marginRight: '0.5rem' }} />
              Search
            </SearchButton>
          </SearchForm>

          <FiltersRow>
            <FilterSelect
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleFilterChange();
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={selectedFormat}
              onChange={(e) => {
                setSelectedFormat(e.target.value);
                handleFilterChange();
              }}
            >
              <option value="">All Formats</option>
              {formats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </FilterSelect>
          </FiltersRow>
        </SearchSection>

        {books.length > 0 ? (
          <>
            <BooksGrid>
              {books.map(book => (
                <BookCard key={book._id}>
                  <BookImage>
                    {book.coverImage ? (
                      <Thumbnail src={book.coverImage} alt={book.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <TitlePlaceholder>
                        <TitleCard>
                          <TitleText>{book.title}</TitleText>
                        </TitleCard>
                      </TitlePlaceholder>
                    )}
                  </BookImage>
                  <BookContent>
                    <BookTitle>{book.title}</BookTitle>
                    <BookAuthor>by {book.author}</BookAuthor>
                    <BookCategory>{book.category}</BookCategory>
                    <BookPrice>₹{book.price}</BookPrice>
                    <BookActions>
                      <ActionButton className="secondary" as={Link} to={`/books/${book._id}`} state={{ book }}>
                        <FaEye style={{ marginRight: '0.5rem' }} />
                        View
                      </ActionButton>
                      {book.isForBorrow && book.availableQuantity > 0 && (
                        <ActionButton 
                          className="primary" 
                          onClick={() => handleBorrow(book._id)}
                        >
                          <FaClock style={{ marginRight: '0.5rem' }} />
                          Borrow
                        </ActionButton>
                      )}
                      {book.isForSale && book.availableQuantity > 0 && (
                        <ActionButton 
                          className="primary"
                          onClick={() => handlePurchase(book._id)}
                        >
                          <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                          Buy
                        </ActionButton>
                      )}
                    </BookActions>
                  </BookContent>
                </BookCard>
              ))}
            </BooksGrid>

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
                    className={currentPage === page ? 'active' : ''}
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
        ) : (
          <EmptyState>
            <h3>No books available</h3>
            <p>
              {searchTerm || selectedCategory || selectedFormat 
                ? 'No books match your search criteria. Try adjusting your filters.'
                : 'The library catalog is empty. Books will appear here once they are added by administrators.'
              }
            </p>
          </EmptyState>
        )}
      </CatalogContent>
    </CatalogContainer>
  );
};

export default BookCatalog;
