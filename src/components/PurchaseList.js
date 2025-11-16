import React, { useState, useEffect } from 'react';
import { phoneAPI } from '../services/api';

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await phoneAPI.getAllPhones();
      if (response.success) {
        setPurchases(response.data);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading purchase history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={fetchPurchases}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="purchases-list">
      <div className="section-header">
        <h2>Purchase History</h2>
        <button className="btn btn-primary" onClick={fetchPurchases}>
          🔄 Refresh
        </button>
      </div>
      
      {purchases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>No Purchases Recorded</h3>
          <p>Start adding phones to see purchase history here</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="phone-table">
              <thead>
                <tr>
                  <th>Phone Model</th>
                  <th>Supplier</th>
                  <th>Purchase Date</th>
                  <th>Purchase Price</th>
                  <th>IMEI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(phone => (
                  <tr key={phone.id}>
                    <td>
                      <div className="phone-model">
                        <span className="model-icon">📱</span>
                        {phone.model}
                      </div>
                    </td>
                    <td>
                      <div className="supplier-info">
                        <span className="supplier-icon">👤</span>
                        {phone.supplier_name}
                      </div>
                    </td>
                    <td>
                      <div className="purchase-date">
                        {new Date(phone.date_in).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="purchase-price">
                        ₦{parseFloat(phone.purchase_price).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="imei-number">
                        {phone.imei}
                      </div>
                    </td>
                    <td>
                      <div className={`status-badge ${phone.status === 'available' ? 'status-available' : 'status-sold'}`}>
                        {phone.status === 'available' ? '🟢 Available' : '✅ Sold'}
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
        .purchases-list {
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
        
        .phone-model, .supplier-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .model-icon, .supplier-icon {
          font-size: 1.1rem;
        }
        
        .purchase-price {
          font-weight: 600;
          color: #ff6b6b;
        }
        
        .imei-number {
          font-family: monospace;
          font-size: 0.9rem;
          color: #666;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
        }
        
        .status-available {
          background: #d4edda;
          color: #155724;
        }
        
        .status-sold {
          background: #f8d7da;
          color: #721c24;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .purchases-list {
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

export default PurchaseList;