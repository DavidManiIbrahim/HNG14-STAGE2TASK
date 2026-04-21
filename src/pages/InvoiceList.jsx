import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { useInvoice } from '../contexts/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import FilterDropdown from '../components/FilterDropdown';
import InvoiceForm from '../components/InvoiceForm';
import './InvoiceList.css';

const InvoiceList = () => {
  const { invoices } = useInvoice();
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredInvoices = filterStatuses.length > 0
    ? invoices.filter(inv => filterStatuses.includes(inv.status))
    : invoices;

  return (
    <div className="invoice-list-page animate-fade-in">
      <header className="page-header">
        <div className="header-text">
          <h1 className="heading-l">Invoices</h1>
          <p className="body-1 text-secondary">
            {invoices.length === 0 
              ? 'No invoices' 
              : `There are ${filteredInvoices.length} total invoices`}
          </p>
        </div>
        
        <div className="header-actions">
          <FilterDropdown 
            filterStatuses={filterStatuses} 
            setFilterStatuses={setFilterStatuses} 
          />
          <button className="btn btn-primary new-invoice-btn" onClick={() => setIsFormOpen(true)}>
            <div className="btn-icon">
              <Plus size={12} color="#7c5dfa" />
            </div>
            <span>New <span className="hide-mobile">Invoice</span></span>
          </button>
        </div>
      </header>

      <div className="invoice-list">
        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <img src="/empty-illustration.svg" alt="No invoices" className="empty-img" />
            <h2 className="heading-m">There is nothing here</h2>
            <p className="body-1 text-secondary">
              Create an invoice by clicking the <br/>
              <span className="text-bold">New Invoice</span> button and get started
            </p>
          </div>
        ) : (
          filteredInvoices.map(invoice => (
            <Link to={`/invoice/${invoice.id}`} key={invoice.id} className="invoice-card">
              <span className="invoice-id text-bold"><span className="hash">#</span>{invoice.id}</span>
              <span className="invoice-date text-secondary">Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="invoice-name text-secondary">{invoice.clientName}</span>
              <span className="invoice-total heading-s">£{invoice.total.toFixed(2)}</span>
              <div className="invoice-status">
                <StatusBadge status={invoice.status} />
              </div>
              <ChevronRight className="chevron-icon hide-mobile" size={16} color="#7c5dfa" />
            </Link>
          ))
        )}
      </div>

      <InvoiceForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default InvoiceList;
