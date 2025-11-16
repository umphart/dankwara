import React, { useState, useEffect } from 'react';
import { salesAPI } from '../services/api';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getAllSales();
      if (response.success) {
        setSales(response.data);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading sales history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={fetchSales}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="sales-list">
      <div className="section-header">
        <h2>Sales History</h2>
        <button className="btn btn-primary" onClick={fetchSales}>
          🔄 Refresh
        </button>
      </div>
      
      {sales.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No Sales Recorded</h3>
          <p>Start selling phones to see sales history here</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="phone-table">
              <thead>
                <tr>
                  <th>Phone Model</th>
                  <th>Customer</th>
                  <th>Sale Date</th>
                  <th>Sale Price</th>
                  <th>IMEI</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id}>
                    <td>
                      <div className="phone-model">
                        <span className="model-icon">📱</span>
                        {sale.model}
                      </div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-icon">👤</span>
                        {sale.customer_name}
                      </div>
                    </td>
                    <td>
                      <div className="sale-date">
                        {new Date(sale.date_out).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="sale-price">
                        ₦{parseFloat(sale.sale_price).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="imei-number">
                        {sale.imei}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .sales-list {
          padding: 1.5rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.4rem;
        }
        
        .loading-state, .error-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #666;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #666;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        .phone-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .phone-table th {
          background: #f8f9fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #eee;
        }
        
        .phone-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .phone-table tr:hover {
          background: #f8f9fa;
        }
        
        .phone-model, .customer-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .model-icon, .customer-icon {
          font-size: 1.1rem;
        }
        
        .sale-price {
          font-weight: 600;
          color: #28a745;
        }
        
        .imei-number {
          font-family: monospace;
          font-size: 0.9rem;
          color: #666;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .sales-list {
            padding: 1rem;
          }
          
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesList;