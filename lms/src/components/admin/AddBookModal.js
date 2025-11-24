import React, { useState } from 'react';
import { FaTimes, FaBook } from 'react-icons/fa';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #E0E0E0;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E0E0E0;
`;

const ModalTitle = styled.h2`
  color: #333333;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999999;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: #F5F5F5;
    color: #000000;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #333333;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;  /* same comfortable padding */
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  transition: all 0.3s ease;
  margin-top: 0.35rem;   /* space between label and field */
  box-sizing: border-box;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #333333;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  margin-top: 0.35rem;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #333333;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
  }

  option {
    background: #FFFFFF;
    color: #333333;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  margin-top: 0.35rem;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  resize: vertical;
  min-height: 100px;
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
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333333;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  
  input {
    accent-color: #3e6d4a; /* custom color for checkbox */
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: #3e6d4a;
    color: #FFFFFF;
    
    &:hover {
      background: #2c5036;
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: transparent;
    color: #3e6d4a;
    border: 1px solid #3e6d4a;
    
    &:hover {
      background: #3e6d4a;
      color: #FFFFFF;
    }
  }
`;

const AddBookModal = ({ isOpen, onClose, onAddBook }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    genre: '',
    publisher: '',
    publishYear: '',
    pages: '',
    language: 'English',
    format: 'Paperback',
    price: '',
    quantity: '',
    coverImage: '',
    isForSale: true,
    isForBorrow: true,
    borrowDuration: 14
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology', 
    'History', 'Biography', 'Self-Help', 'Business', 
    'Literature', 'Children', 'Other'
  ];

  // Generate a unique ISBN for testing
  const generateUniqueISBN = () => {
    return '978' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  };

  const formats = ['Hardcover', 'Paperback', 'E-Book', 'Audiobook'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Form submitted with data:', formData);
      
      // Validate required fields
      if (!formData.title || !formData.author || !formData.isbn || !formData.description || !formData.category || !formData.price || !formData.quantity) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Convert string values to appropriate types
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        borrowDuration: parseInt(formData.borrowDuration),
        // Ensure availableQuantity is set correctly (will be overridden by backend)
        availableQuantity: parseInt(formData.quantity)
      };

      console.log('Sending book data:', bookData);
      await onAddBook(bookData);
      onClose();
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        category: '',
        genre: '',
        publisher: '',
        publishYear: '',
        pages: '',
        language: 'English',
        format: 'Paperback',
        price: '',
        quantity: '',
        coverImage: '',
        isForSale: true,
        isForBorrow: true,
        borrowDuration: 14
      });
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FaBook style={{ marginRight: '0.5rem' }} />
            Add New Book
          </ModalTitle>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: 'Test Book ' + Math.floor(Math.random() * 1000),
                  author: 'Test Author',
                  isbn: generateUniqueISBN(),
                  description: 'This is a test book description for testing purposes.',
                  category: 'Fiction',
                  genre: 'Test Genre',
                  publisher: 'Test Publisher',
                  publishYear: '2023',
                  pages: '200',
                  language: 'English',
                  format: 'Paperback',
                  price: '500',
                  quantity: '10',
                  coverImage: '',
                  isForSale: true,
                  isForBorrow: true,
                  borrowDuration: 14
                });
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#81927c',
                color: '#111a19',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Fill Test Data
            </button>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </div>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Title *</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Author *</Label>
              <Input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>ISBN *</Label>
              <Input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Category *</Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>Genre</Label>
              <Input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Enter genre"
              />
            </FormGroup>
            <FormGroup>
              <Label>Publisher</Label>
              <Input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Enter publisher"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Publish Year</Label>
              <Input
                type="number"
                name="publishYear"
                value={formData.publishYear}
                onChange={handleChange}
                placeholder="Enter publish year"
                min="1800"
                max={new Date().getFullYear()}
              />
            </FormGroup>
            <FormGroup>
              <Label>Pages</Label>
              <Input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                placeholder="Enter number of pages"
                min="1"
              />
            </FormGroup>
          </FormRow>

           <FormRow>
             <FormGroup>
               <Label>Language</Label>
               <Select
                 name="language"
                 value={formData.language}
                 onChange={handleChange}
               >
                 {languages.map(language => (
                   <option key={language} value={language}>{language}</option>
                 ))}
               </Select>
             </FormGroup>
            <FormGroup>
              <Label>Format</Label>
              <Select
                name="format"
                value={formData.format}
                onChange={handleChange}
              >
                {formats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Quantity *</Label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Cover Image URL</Label>
            <Input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="Enter cover image URL"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="isForSale"
                  checked={formData.isForSale}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Available for Sale
              </CheckboxLabel>
            </FormGroup>
            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="isForBorrow"
                  checked={formData.isForBorrow}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Available for Borrow
              </CheckboxLabel>
            </FormGroup>
          </FormRow>

          {formData.isForBorrow && (
            <FormGroup>
              <Label>Borrow Duration (days)</Label>
              <Input
                type="number"
                name="borrowDuration"
                value={formData.borrowDuration}
                onChange={handleChange}
                placeholder="Enter borrow duration"
                min="1"
                max="30"
              />
            </FormGroup>
          )}

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddBookModal;
