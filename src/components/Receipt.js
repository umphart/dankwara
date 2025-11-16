import React from 'react';

const Receipt = ({ sale, phone, onPrint }) => {
  const profit = sale.salePrice - phone.purchasePrice;

  return (
    <div className="receipt">
      <div className="receipt-header">
        <h2>Dankwara Phone Sales</h2>
        <p>Sales Receipt</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="receipt-item">
        <span>Phone Model:</span>
        <span>{phone.model}</span>
      </div>
      
      <div className="receipt-item">
        <span>IMEI:</span>
        <span>{phone.imei}</span>
      </div>
      
      <div className="receipt-item">
        <span>Customer:</span>
        <span>{sale.customerName}</span>
      </div>
      
      <div className="receipt-item">
        <span>Sale Date:</span>
        <span>{new Date(sale.dateOut).toLocaleDateString()}</span>
      </div>
      
      <div className="receipt-item">
        <span>Sale Price:</span>
        <span>${sale.salePrice.toFixed(2)}</span>
      </div>
      
      <div className="receipt-item">
        <span>Purchase Price:</span>
        <span>${phone.purchasePrice.toFixed(2)}</span>
      </div>
      
      <div className="receipt-total">
        <span>Profit:</span>
        <span style={{ color: profit >= 0 ? '#28a745' : '#dc3545' }}>
          ${profit.toFixed(2)}
        </span>
      </div>
      
      <button className="btn btn-primary print-btn" onClick={onPrint}>
        Print Receipt
      </button>
    </div>
  );
};

export default Receipt;