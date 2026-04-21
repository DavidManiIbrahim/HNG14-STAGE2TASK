import React, { useState, useEffect } from 'react';
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (invoiceToEdit) {
      setFormData(invoiceToEdit);
    } else {
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

  const calculatePaymentDue = () => {
    const date = new Date(formData.createdAt);
    date.setDate(date.getDate() + Number(formData.paymentTerms));
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (status) => {
    if (status !== 'Draft' && !validate()) return;

    const invoiceData = {
      ...formData,
      status,
      total: calculateTotal(),
      paymentDue: calculatePaymentDue()
    };

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    onClose();
  };

  return (
    <div className="form-overlay animate-fade-in">
      <div className="form-container">
        <button className="back-link mobile-only" onClick={onClose}>
          <ChevronLeft size={16} color="#7c5dfa" /> Go back
        </button>
        
        <h2 className="heading-m form-title">
          {invoiceToEdit ? `Edit #${invoiceToEdit.id}` : 'New Invoice'}
        </h2>

        <div className="form-scroll">
          <section className="form-section">
            <h4 className="section-title">Bill From</h4>
            <div className="input-group">
              <label className="input-label">
                Street Address {errors['senderAddress.street'] && <span className="input-error-msg">{errors['senderAddress.street']}</span>}
              </label>
              <input type="text" className={`input-field ${errors['senderAddress.street'] ? 'error' : ''}`} name="street" value={formData.senderAddress.street} onChange={(e) => handleNestedChange(e, 'senderAddress')} />
            </div>
            <div className="form-row-3">
              <div className="input-group">
                <label className="input-label">City</label>
                <input type="text" className="input-field" name="city" value={formData.senderAddress.city} onChange={(e) => handleNestedChange(e, 'senderAddress')} />
              </div>
              <div className="input-group">
                <label className="input-label">Post Code</label>
                <input type="text" className="input-field" name="postCode" value={formData.senderAddress.postCode} onChange={(e) => handleNestedChange(e, 'senderAddress')} />
              </div>
              <div className="input-group full-width-mobile">
                <label className="input-label">Country</label>
                <input type="text" className="input-field" name="country" value={formData.senderAddress.country} onChange={(e) => handleNestedChange(e, 'senderAddress')} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h4 className="section-title">Bill To</h4>
            <div className="input-group">
              <label className="input-label">
                Client's Name {errors.clientName && <span className="input-error-msg">{errors.clientName}</span>}
              </label>
              <input type="text" className={`input-field ${errors.clientName ? 'error' : ''}`} name="clientName" value={formData.clientName} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">
                Client's Email {errors.clientEmail && <span className="input-error-msg">{errors.clientEmail}</span>}
              </label>
              <input type="email" className={`input-field ${errors.clientEmail ? 'error' : ''}`} name="clientEmail" value={formData.clientEmail} onChange={handleChange} placeholder="e.g. email@example.com" />
            </div>
            <div className="input-group">
              <label className="input-label">
                Street Address {errors['clientAddress.street'] && <span className="input-error-msg">{errors['clientAddress.street']}</span>}
              </label>
              <input type="text" className={`input-field ${errors['clientAddress.street'] ? 'error' : ''}`} name="street" value={formData.clientAddress.street} onChange={(e) => handleNestedChange(e, 'clientAddress')} />
            </div>
            <div className="form-row-3">
              <div className="input-group">
                <label className="input-label">City</label>
                <input type="text" className="input-field" name="city" value={formData.clientAddress.city} onChange={(e) => handleNestedChange(e, 'clientAddress')} />
              </div>
              <div className="input-group">
                <label className="input-label">Post Code</label>
                <input type="text" className="input-field" name="postCode" value={formData.clientAddress.postCode} onChange={(e) => handleNestedChange(e, 'clientAddress')} />
              </div>
              <div className="input-group full-width-mobile">
                <label className="input-label">Country</label>
                <input type="text" className="input-field" name="country" value={formData.clientAddress.country} onChange={(e) => handleNestedChange(e, 'clientAddress')} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-row-2">
              <div className="input-group">
                <label className="input-label">Invoice Date</label>
                <input type="date" className="input-field" name="createdAt" value={formData.createdAt} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Payment Terms</label>
                <select className="input-field select-field" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange}>
                  <option value="1">Net 1 Day</option>
                  <option value="7">Net 7 Days</option>
                  <option value="14">Net 14 Days</option>
                  <option value="30">Net 30 Days</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">
                Project Description {errors.description && <span className="input-error-msg">{errors.description}</span>}
              </label>
              <input type="text" className={`input-field ${errors.description ? 'error' : ''}`} name="description" value={formData.description} onChange={handleChange} />
            </div>
          </section>

          <section className="form-section">
            <h3 className="item-list-title">Item List</h3>
            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="input-group item-name">
                  <label className="input-label hide-desktop">Item Name</label>
                  <input type="text" className={`input-field ${errors[`item.${index}.name`] ? 'error' : ''}`} name="name" value={item.name} onChange={(e) => handleItemChange(index, e)} />
                </div>
                <div className="input-group item-qty">
                  <label className="input-label hide-desktop">Qty.</label>
                  <input type="number" className={`input-field ${errors[`item.${index}.quantity`] ? 'error' : ''}`} name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
                </div>
                <div className="input-group item-price">
                  <label className="input-label hide-desktop">Price</label>
                  <input type="number" className={`input-field ${errors[`item.${index}.price`] ? 'error' : ''}`} name="price" value={item.price} onChange={(e) => handleItemChange(index, e)} />
                </div>
                <div className="input-group item-total">
                  <label className="input-label hide-desktop">Total</label>
                  <div className="item-total-value">{item.total.toFixed(2)}</div>
                </div>
                <button className="delete-item-btn" onClick={() => removeItem(index)}>
                  <Trash2 size={20} color="#888eb0" />
                </button>
              </div>
            ))}
            {errors.items && <p className="input-error-msg" style={{marginBottom: '16px'}}>{errors.items}</p>}
            <button className="btn btn-secondary full-width" onClick={addItem}>+ Add New Item</button>
          </section>
        </div>

        <div className="form-actions">
          {invoiceToEdit ? (
            <>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSubmit('Pending')}>Save Changes</button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={onClose}>Discard</button>
              <div className="action-right">
                <button className="btn btn-draft" onClick={() => handleSubmit('Draft')}>Save as Draft</button>
                <button className="btn btn-primary" onClick={() => handleSubmit('Pending')}>Save & Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
