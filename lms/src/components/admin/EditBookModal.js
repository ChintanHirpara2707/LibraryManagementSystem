import React, { useEffect, useState } from 'react';
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
  color: #f7d7a8;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  transition: all 0.3s ease;
  margin-top: 0.35rem;
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
  }
  
  &.secondary {
    background: transparent;
    color: #3e6d4a;
    border: 1px solid #3e6d4a;
  }
`;

const EditBookModal = ({ isOpen, onClose, book, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        category: book.category || '',
        price: book.price ?? '',
        quantity: book.quantity ?? '',
        availableQuantity: book.availableQuantity ?? '',
        coverImage: book.coverImage || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: formData.price === '' ? undefined : parseFloat(formData.price),
        quantity: formData.quantity === '' ? undefined : parseInt(formData.quantity),
        availableQuantity: formData.availableQuantity === '' ? undefined : parseInt(formData.availableQuantity)
      };
      await onUpdate(book._id, payload);
      onClose();
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
            Edit Book
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Title</Label>
              <Input name="title" value={formData.title || ''} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Author</Label>
              <Input name="author" value={formData.author || ''} onChange={handleChange} />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Description</Label>
            <TextArea name="description" value={formData.description || ''} onChange={handleChange} />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>Category</Label>
              <Input name="category" value={formData.category || ''} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Cover Image URL</Label>
              <Input name="coverImage" value={formData.coverImage || ''} onChange={handleChange} />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Price (₹)</Label>
              <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Quantity</Label>
              <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Available Quantity</Label>
            <Input type="number" name="availableQuantity" value={formData.availableQuantity} onChange={handleChange} />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditBookModal;


