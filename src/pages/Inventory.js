import React, { useState } from 'react';
import PhoneForm from '../components/PhoneForm';
import PhoneList from '../components/PhoneList';
import SalesList from '../components/SalesList';
import PurchaseList from '../components/PurchaseList';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [refreshList, setRefreshList] = useState(0);

  const handlePhoneAdded = () => {
    setRefreshList(prev => prev + 1);
  };

  const tabs = [
    { id: 'add', label: '➕ Add Phone', component: <PhoneForm onPhoneAdded={handlePhoneAdded} /> },
    { id: 'view', label: '📱 View Phones', component: <PhoneList onSellPhone={(phone) => window.location.href = '/sales'} refresh={refreshList} /> },
    { id: 'sales', label: '💰 Sales History', component: <SalesList /> },
    { id: 'purchases', label: '🛒 Purchase History', component: <PurchaseList /> }
  ];

  return (
    <div className="inventory-page">
      <h1>Phone Inventory Management</h1>
      
      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
      
      <style jsx>{`
        .inventory-page {
          padding: 1rem;
        }
        
        .inventory-page h1 {
          color: #333;
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.8rem;
        }
        
        .tabs-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .tabs-header {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          overflow-x: auto;
        }
        
        .tab-button {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: #666;
          transition: all 0.3s ease;
          white-space: nowrap;
          min-width: 140px;
        }
        
        .tab-button:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
        
        .tab-button.active {
          background: white;
          color: #667eea;
          border-bottom: 3px solid #667eea;
        }
        
        .tab-content {
          padding: 0;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .inventory-page {
            padding: 0.5rem;
          }
          
          .tabs-header {
            flex-direction: column;
          }
          
          .tab-button {
            min-width: auto;
            text-align: center;
          }
        }
        
        @media (min-width: 769px) {
          .tabs-header {
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Inventory;