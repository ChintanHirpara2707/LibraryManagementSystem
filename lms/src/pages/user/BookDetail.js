import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaUser, FaCalendar, FaTag, FaDollarSign, FaClock, FaShoppingCart, FaEye, FaArrowLeft } from 'react-icons/fa';
import styled from 'styled-components';
import { gsap } from 'gsap';

const BookDetailContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 2rem 0;
`;

const BookDetailContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #000000;
    transform: translateX(-5px);
  }
`;

const BookCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  border: 1px solid #E0E0E0;
`;

const BookHeader = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BookImage = styled.div`
  height: 400px;
  background: #f4f4f4;
  border-right: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  perspective: 1200px;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #E0E0E0;
  }
`;

const CatalogCover = styled.div`
  width: 260px;
  height: 360px;
  background: ${({ category }) => {
    switch (category?.toLowerCase()) {
      case 'classic':
        return 'linear-gradient(135deg, #6b4226, #a47551)';
      case 'fantasy':
        return 'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)';
      case 'science':
        return 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)';
      case 'history':
        return 'linear-gradient(135deg, #755139, #a67b5b)';
      case 'biography':
        return 'linear-gradient(135deg, #283048, #859398)';
      default:
        return 'linear-gradient(135deg, #5A5A5A, #8D8D8D)';
    }
  }};
  border-radius: 6px;
  box-shadow: -8px 6px 20px rgba(0,0,0,0.3);
  transform: rotateY(-10deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  color: #fff;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: rotateY(0deg) translateY(-4px);
    box-shadow: -4px 12px 28px rgba(0,0,0,0.45);
  }
`;

const CatalogTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
`;

const CatalogAuthor = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  font-style: italic;
`;

const CoverImage = styled.img`
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
  perspective: 1000px;
`;

const TitleCard = styled.div`
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  color: #333333;
  padding: 1.25rem 1.5rem;
  max-width: 85%;
  transform: rotateX(8deg) rotateY(-6deg);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(0,0,0,0.03);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  text-align: center;
  will-change: transform;

  ${BookImage}:hover & {
    transform: rotateX(0deg) rotateY(0deg) translateY(-2px);
    box-shadow: 0 20px 45px rgba(17, 26, 25, 0.5), inset 0 1px 0 rgba(255,255,255,0.08);
  }
`;

const TitleText = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.25;
  text-shadow: 0 2px 0 rgba(0,0,0,0.25);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const BookInfo = styled.div`
  padding: 2rem;
`;

const BookTitle = styled.h1`
  font-size: 2.2rem;
  color: #333333;
  margin-bottom: 1rem;
  line-height: 1.2;
  font-weight: 600;
`;

const BookAuthor = styled.p`
  font-size: 1.2rem;
  color: #666666;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const BookMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: #F8F9FA;
  padding: 1.5rem;
  border-radius: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #81927c;
  
  .icon {
    color: #333333;
    font-size: 1.2rem;
  }
`;

const BookPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const BookActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background: #3e6d4a;
    color: #FFFFFF;
    
    &:hover {
      background: #2c5036;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: transparent;
    color: #3e6d4a;
    border: 1px solid #3e6d4a;
    
    &:hover {
      background: #2c5036;
      border-color: #2c5036;
      color: #FFFFFF;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const BookDescription = styled.div`
  padding: 2rem;
  border-top: 1px solid #f0f0f0;
`;

const DescriptionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 1rem;
`;

const DescriptionText = styled.p`
  color: #666666;
  line-height: 1.8;
  font-size: 1.1rem;
`;

const BookDetails = styled.div`
  padding: 2rem;
  border-top: 1px solid #f0f0f0;
`;

const DetailsTitle = styled.h2`
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const DetailItem = styled.div`
  padding: 1rem;
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #E0E0E0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  color: #666666;
`;

const AvailabilityStatus = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  &.available {
    background: #d4edda;
    color: #155724;
  }
  
  &.unavailable {
    background: #f8d7da;
    color: #721c24;
  }
`;

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const imageRef = useRef(null);
  const infoRef = useRef(null);

  // Fetch book by id from API (return raw API response)
  const getBookById = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, { headers });
      if (!response.ok) {
        console.warn('Book fetch failed', response.status, response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Book detail data:', data);
      return data;
    } catch (e) {
      console.error('Error fetching book:', e);
      return null;
    }
  };


  useEffect(() => {
    const stateBook = location.state && location.state.book;
    if (stateBook && stateBook._id === id) {
      setBook(stateBook);
      setLoading(false);
    } else {
      const load = async () => {
        setLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);
        setLoading(false);
      };
      load();
    }
  }, [id, location.state]);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from(imageRef.current, { autoAlpha: 0, x: -20, duration: 0.6, ease: 'power2.out' });
        gsap.from(infoRef.current, { autoAlpha: 0, x: 20, duration: 0.6, ease: 'power2.out' });
      });
      return () => ctx.revert();
    }
  }, [loading]);

  const handleBorrow = async () => {
    if (!user) {
      alert('Please login to borrow books');
      return;
    }
    if (!book || processing) return;
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/books/${book._id || id}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to borrow book');
        return;
      }
      // Optimistically update local book availability
      setBook(prev => prev ? {
        ...prev,
        availableQuantity: Math.max(0, (prev.availableQuantity || 0) - 1),
        isAvailable: Math.max(0, (prev.availableQuantity || 0) - 1) > 0
      } : prev);
      alert('Book borrowed successfully');
      // Optionally: navigate to transactions or refetch book
    } catch (err) {
      console.error('Error borrowing book:', err);
      alert('Failed to borrow book. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      // Redirect to login
      return;
    }
    // Implement purchase logic
    console.log('Purchasing book:', book.title);
  };

  if (loading) {
    return (
      <BookDetailContainer>
        <BookDetailContent>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div>Loading book details...</div>
          </div>
        </BookDetailContent>
      </BookDetailContainer>
    );
  }

  if (!book) {
    return (
      <BookDetailContainer>
        <BookDetailContent>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div>Book not found</div>
          </div>
        </BookDetailContent>
      </BookDetailContainer>
    );
  }

  return (
    <BookDetailContainer>
      <BookDetailContent>
        <BackButton to="/books">
          <FaArrowLeft />
          Back to Catalog
        </BackButton>

        <BookCard>
          <BookHeader>
          <BookImage ref={imageRef}>
            {book.coverImage ? (
            <CoverImage src={book.coverImage} alt={book.title} />
            ) : (
              <CatalogCover category={book.category}>
                <CatalogTitle>{book.title}</CatalogTitle>
                <CatalogAuthor>{book.author}</CatalogAuthor>
              </CatalogCover>
            )}
         </BookImage>

            
            <BookInfo ref={infoRef}>
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>by {book.author}</BookAuthor>
              
              <AvailabilityStatus className={book.isAvailable ? 'available' : 'unavailable'}>
                {book.isAvailable ? 'Available' : 'Not Available'}
              </AvailabilityStatus>
              
              <BookPrice>{book.price}₹</BookPrice>
              
              <BookMeta>
                <MetaItem>
                  <FaTag className="icon" />
                  {book.category}
                </MetaItem>
                <MetaItem>
                  <FaUser className="icon" />
                  {book.author}
                </MetaItem>
                <MetaItem>
                  <FaCalendar className="icon" />
                  {book.publishYear}
                </MetaItem>
                <MetaItem>
                  <FaBook className="icon" />
                  {book.pages} pages
                </MetaItem>
              </BookMeta>
              
              <BookActions>
                {book.isForBorrow && book.isAvailable && (
                  <ActionButton className="primary" onClick={handleBorrow} disabled={processing}>
                    <FaClock />
                    {processing ? 'Processing...' : `Borrow for ${book.borrowDuration} days`}
                  </ActionButton>
                )}
                
                {/* {book.isForSale && book.isAvailable && (
                  <ActionButton className="primary" onClick={handlePurchase}>
                    <FaShoppingCart />
                    Purchase
                  </ActionButton>
                )} */}
                
                {/* <ActionButton className="secondary">
                  <FaEye />
                  Preview
                </ActionButton> */}
              </BookActions>
            </BookInfo>
          </BookHeader>

          <BookDescription>
            <DescriptionTitle>Description</DescriptionTitle>
            <DescriptionText>{book.description}</DescriptionText>
          </BookDescription>

          <BookDetails>
            <DetailsTitle>Book Details</DetailsTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>ISBN</DetailLabel>
                <DetailValue>978-0743273565</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Publisher</DetailLabel>
                <DetailValue>{book.publisher}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Publication Year</DetailLabel>
                <DetailValue>{book.publishYear}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Pages</DetailLabel>
                <DetailValue>{book.pages}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Language</DetailLabel>
                <DetailValue>{book.language}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Format</DetailLabel>
                <DetailValue>{book.format}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Available Copies</DetailLabel>
                <DetailValue>{book.availableQuantity} of {book.quantity}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Rating</DetailLabel>
                <DetailValue>
                  {(book && book.rating && typeof book.rating.average === 'number' ? book.rating.average : 0)}/5 ({(book && book.rating && typeof book.rating.count === 'number' ? book.rating.count : 0)} reviews)
                </DetailValue>
              </DetailItem>
            </DetailsGrid>
            
            {book.tags && book.tags.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <DetailLabel>Tags</DetailLabel>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {book.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#c96e34',
                        color: '#f7d7a8',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.875rem'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </BookDetails>
        </BookCard>
      </BookDetailContent>
    </BookDetailContainer>
  );
};

export default BookDetail;
