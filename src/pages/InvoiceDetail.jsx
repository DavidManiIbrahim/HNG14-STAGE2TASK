import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useInvoice } from '../contexts/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import InvoiceForm from '../components/InvoiceForm';
import './InvoiceDetail.css';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, deleteInvoice, markAsPaid } = useInvoice();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="invoice-detail-page">
        <div className="not-found">
          <h2 className="heading-m">Invoice not found</h2>
          <Link to="/" className="back-link">Go back</Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(id);
    navigate('/');
  };

  return (
    <div className="invoice-detail-page animate-fade-in">
      <Link to="/" className="back-link body-1 text-bold">
        <ChevronLeft size={16} color="#7c5dfa" />
        Go back
      </Link>

      <header className="detail-header">
        <div className="status-section">
          <span className="body-1 text-secondary">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className="action-buttons hide-mobile">
          <button className="btn btn-secondary" onClick={() => setIsEditFormOpen(true)}>Edit</button>
          <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
          {invoice.status !== 'Paid' && (
            <button className="btn btn-primary" onClick={() => markAsPaid(id)}>Mark as Paid</button>
          )}
        </div>
      </header>

      <main className="detail-body">
        <div className="detail-top">
          <div className="detail-id-desc">
            <h2 className="heading-s"><span className="hash">#</span>{invoice.id}</h2>
            <p className="body-1 text-secondary">{invoice.description}</p>
          </div>
          <div className="detail-sender-address body-1 text-secondary">
            <p>{invoice.senderAddress?.street}</p>
            <p>{invoice.senderAddress?.city}</p>
            <p>{invoice.senderAddress?.postCode}</p>
            <p>{invoice.senderAddress?.country}</p>
          </div>
        </div>

        <div className="detail-middle">
          <div className="date-section">
            <div className="date-block">
              <span className="body-1 text-secondary">Invoice Date</span>
              <h3 className="heading-s">{new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
            </div>
            <div className="date-block">
              <span className="body-1 text-secondary">Payment Due</span>
              <h3 className="heading-s">{new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
            </div>
          </div>

          <div className="bill-to-section">
            <span className="body-1 text-secondary">Bill To</span>
            <h3 className="heading-s">{invoice.clientName}</h3>
            <div className="body-1 text-secondary">
              <p>{invoice.clientAddress?.street}</p>
              <p>{invoice.clientAddress?.city}</p>
              <p>{invoice.clientAddress?.postCode}</p>
              <p>{invoice.clientAddress?.country}</p>
            </div>
          </div>

          <div className="sent-to-section">
            <span className="body-1 text-secondary">Sent to</span>
            <h3 className="heading-s">{invoice.clientEmail}</h3>
          </div>
        </div>

        <div className="detail-items">
          <table className="items-table">
            <thead>
              <tr>
                <th className="body-1 text-secondary text-left">Item Name</th>
                <th className="body-1 text-secondary text-center">QTY.</th>
                <th className="body-1 text-secondary text-right">Price</th>
                <th className="body-1 text-secondary text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td className="text-bold">{item.name}</td>
                  <td className="text-center text-bold text-secondary">{item.quantity}</td>
                  <td className="text-right text-bold text-secondary">£{item.price.toFixed(2)}</td>
                  <td className="text-right text-bold">£{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="items-mobile-list">
            {invoice.items?.map((item, index) => (
              <div key={index} className="mobile-item">
                <div className="mobile-item-left">
                  <span className="text-bold">{item.name}</span>
                  <span className="text-bold text-secondary">{item.quantity} x £{item.price.toFixed(2)}</span>
                </div>
                <div className="mobile-item-right text-bold">£{item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="detail-total">
            <span className="body-1 text-white">Amount Due</span>
            <h2 className="heading-m text-white">£{invoice.total.toFixed(2)}</h2>
          </div>
        </div>
      </main>

      <div className="action-buttons mobile-only">
        <button className="btn btn-secondary" onClick={() => setIsEditFormOpen(true)}>Edit</button>
        <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
        {invoice.status !== 'Paid' && (
          <button className="btn btn-primary" onClick={() => markAsPaid(id)}>Mark as Paid</button>
        )}
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete}
        invoiceId={id}
      />

      <InvoiceForm 
        isOpen={isEditFormOpen} 
        onClose={() => setIsEditFormOpen(false)} 
        invoiceToEdit={invoice} 
      />
    </div>
  );
};

export default InvoiceDetail;
