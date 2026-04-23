import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, ChevronLeft } from 'lucide-react';
import { useInvoice } from '../contexts/InvoiceContext';
import './InvoiceForm.css';

const initialFormState = {
  clientName: '',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
  items: []
};

const InvoiceForm = ({ isOpen, onClose, invoiceToEdit }) => {
  const { addInvoice, updateInvoice } = useInvoice();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoiceToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(invoiceToEdit);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...initialFormState,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [invoiceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [name]: value }
    }));
    if (errors[`${section}.${name}`]) setErrors(prev => ({ ...prev, [`${section}.${name}`]: '' }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { 
      ...newItems[index], 
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value 
    };
    newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].price || 0);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 0, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = "can't be empty";
    if (!formData.clientEmail) {
      newErrors.clientEmail = "can't be empty";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "invalid email format";
    }
    if (!formData.description) newErrors.description = "can't be empty";
    
    // Address validations (simplified)
    if (!formData.clientAddress.street) newErrors['clientAddress.street'] = "can't be empty";
    if (!formData.senderAddress.street) newErrors['senderAddress.street'] = "can't be empty";
    
    if (formData.items.length === 0) {
      newErrors.items = "An item must be added";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.name) newErrors[`item.${index}.name`] = "can't be empty";
        if (item.quantity <= 0) newErrors[`item.${index}.quantity`] = "must be > 0";
        if (item.price <= 0) newErrors[`item.${index}.price`] = "must be > 0";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return formData.items.reduce((acc, item) => acc + item.total, 0);
  };

  const handleSubmit = (status) => {
    if (status !== 'Draft' && !validate()) return;

    const invoiceData = {
      ...formData,
      status,
      total: calculateTotal(),
      paymentDue: calculatePaymentDue(formData.createdAt, formData.paymentTerms)
    };

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    onClose();
  };

  const calculatePaymentDue = (dateStr, terms) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + terms);
    return date.toISOString().split('T')[0];
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].price || 0);
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const modalContent = (
    <div className="form-overlay animate-fade-in">
      <div className="form-container">
        <div className="form-content-wrapper">
          <button className="back-link mobile-only" onClick={onClose}>
            <ChevronLeft size={16} color="#7c5dfa" /> Go back
          </button>
          
          <h1 className="heading-m">
            {invoiceToEdit ? (
              <>Edit <span className="hash">#</span>{invoiceToEdit.id}</>
            ) : 'New Invoice'}
          </h1>

          <div className="form-scroll">
            <section className="form-section">
              <h3 className="section-title">Bill From</h3>
              <div className="input-group">
                <div className="input-label-row">
                  <label className="input-label">Street Address</label>
                  {errors['senderAddress.street'] && <span className="input-error-msg">{errors['senderAddress.street']}</span>}
                </div>
                <input 
                  type="text" 
                  name="street"
                  className={`input-field ${errors['senderAddress.street'] ? 'error' : ''}`}
                  value={formData.senderAddress.street}
                  onChange={(e) => handleNestedChange(e, 'senderAddress')}
                />
              </div>
              <div className="form-row-3">
                <div className="input-group">
                  <div className="input-label-row">
                    <label className="input-label">City</label>
                    {errors['senderAddress.city'] && <span className="input-error-msg">{errors['senderAddress.city']}</span>}
                  </div>
                  <input 
                    type="text" 
                    name="city"
                    className={`input-field ${errors['senderAddress.city'] ? 'error' : ''}`}
                    value={formData.senderAddress.city}
                    onChange={(e) => handleNestedChange(e, 'senderAddress')}
                  />
                </div>
                <div className="input-group">
                  <div className="input-label-row">
                    <label className="input-label">Post Code</label>
                    {errors['senderAddress.postCode'] && <span className="input-error-msg">{errors['senderAddress.postCode']}</span>}
                  </div>
                  <input 
                    type="text" 
                    name="postCode"
                    className={`input-field ${errors['senderAddress.postCode'] ? 'error' : ''}`}
                    value={formData.senderAddress.postCode}
                    onChange={(e) => handleNestedChange(e, 'senderAddress')}
                  />
                </div>
                <div className="input-group full-width-mobile">
                  <div className="input-label-row">
                    <label className="input-label">Country</label>
                    {errors['senderAddress.country'] && <span className="input-error-msg">{errors['senderAddress.country']}</span>}
                  </div>
                  <input 
                    type="text" 
                    name="country"
                    className={`input-field ${errors['senderAddress.country'] ? 'error' : ''}`}
                    value={formData.senderAddress.country}
                    onChange={(e) => handleNestedChange(e, 'senderAddress')}
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3 className="section-title">Bill To</h3>
              <div className="input-group">
                <div className="input-label-row">
                  <label className="input-label">Client's Name</label>
                  {errors.clientName && <span className="input-error-msg">{errors.clientName}</span>}
                </div>
                <input 
                  type="text" 
                  name="clientName"
                  className={`input-field ${errors.clientName ? 'error' : ''}`}
                  value={formData.clientName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <div className="input-label-row">
                  <label className="input-label">Client's Email</label>
                  {errors.clientEmail && <span className="input-error-msg">{errors.clientEmail}</span>}
                </div>
                <input 
                  type="email" 
                  name="clientEmail"
                  className={`input-field ${errors.clientEmail ? 'error' : ''}`}
                  placeholder="e.g. email@example.com"
                  value={formData.clientEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <div className="input-label-row">
                  <label className="input-label">Street Address</label>
                  {errors['clientAddress.street'] && <span className="input-error-msg">{errors['clientAddress.street']}</span>}
                </div>
                <input 
                  type="text" 
                  name="street"
                  className={`input-field ${errors['clientAddress.street'] ? 'error' : ''}`}
                  value={formData.clientAddress.street}
                  onChange={(e) => handleNestedChange(e, 'clientAddress')}
                />
              </div>
              <div className="form-row-3">
                <div className="input-group">
                  <div className="input-label-row">
                    <label className="input-label">City</label>
                    {errors['clientAddress.city'] && <span className="input-error-msg">{errors['clientAddress.city']}</span>}
                  </div>
                  <input 
                    type="text" 
                    name="city"
                    className={`input-field ${errors['clientAddress.city'] ? 'error' : ''}`}
                    value={formData.clientAddress.city}
                    onChange={(e) => handleNestedChange(e, 'clientAddress')}
                  />
                </div>
                <div className="input-group">
                  <div className="input-label-row">
                    <label className="input-label">Post Code</label>
                    {errors['clientAddress.postCode'] && <span className="input-error-msg">{errors['clientAddress.postCode']}</span>}
                  </div>
                  <input 
                    type="text" 
                    name="postCode"
                    className={`input-field ${errors['clientAddress.postCode'] ? 'error' : ''}`}
                    value={formData.clientAddress.postCode}
                    onChange={(e) => handleNestedChange(e, 'clientAddress')}
                  />
                </div>
                <div className="input-group full-width-mobile">
                  <div className="input-label-row">
                    <label className="input-label">Country</label>
                    {errors['clientAddress.country'] && <span className="input-error-msg">{errors['clientAddress.country']}</span>}
                  </div>
                  <input 
                    type="text" 
                    name="country"
                    className={`input-field ${errors['clientAddress.country'] ? 'error' : ''}`}
                    value={formData.clientAddress.country}
                    onChange={(e) => handleNestedChange(e, 'clientAddress')}
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="form-row-2">
                <div className="input-group">
                  <div className="input-label-row">
                    <label className="input-label">Invoice Date</label>
                    {errors.createdAt && <span className="input-error-msg">{errors.createdAt}</span>}
                  </div>
                  <input 
                    type="date" 
                    name="createdAt"
                    className={`input-field ${errors.createdAt ? 'error' : ''}`}
                    value={formData.createdAt}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Payment Terms</label>
                  <select 
                    name="paymentTerms"
                    className="input-field select-field"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({...formData, paymentTerms: parseInt(e.target.value)})}
                  >
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <div className="input-label-row">
                  <label className="input-label">Project Description</label>
                  {errors.description && <span className="input-error-msg">{errors.description}</span>}
                </div>
                <input 
                  type="text" 
                  name="description"
                  className={`input-field ${errors.description ? 'error' : ''}`}
                  placeholder="e.g. Graphic Design Service"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className="form-section">
              <h2 className="item-list-title">Item List</h2>
              <div className="item-list">
                {formData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="input-group item-name">
                      <label className="input-label hide-desktop">Item Name</label>
                      <input 
                        type="text" 
                        className="input-field"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="input-group item-qty">
                      <label className="input-label hide-desktop">Qty.</label>
                      <input 
                        type="number" 
                        className="input-field"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-group item-price">
                      <label className="input-label hide-desktop">Price</label>
                      <input 
                        type="number" 
                        className="input-field"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="input-group item-total">
                      <label className="input-label hide-desktop">Total</label>
                      <div className="item-total-value">
                        {item.total.toFixed(2)}
                      </div>
                    </div>
                    <button className="delete-item-btn" onClick={() => removeItem(index)} aria-label="Delete item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {errors.items && <p className="input-error-msg" style={{marginBottom: '16px'}}>{errors.items}</p>}
              <button className="btn btn-tertiary full-width" onClick={addItem}>+ Add New Item</button>
            </section>
          </div>
        </div>

        <div className="form-actions">
          {invoiceToEdit ? (
            <div className="action-right w-full" style={{justifyContent: 'flex-end'}}>
              <button className="btn btn-tertiary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSubmit('Pending')}>Save Changes</button>
            </div>
          ) : (
            <>
              <button className="btn btn-tertiary discard-btn" onClick={onClose}>Discard</button>
              <div className="action-right">
                <button className="btn btn-secondary btn-draft" onClick={() => handleSubmit('Draft')}>Save as Draft</button>
                <button className="btn btn-primary" onClick={() => handleSubmit('Pending')}>Save & Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InvoiceForm;
