import React, { useState, useEffect } from 'react';
import { phoneAPI } from '../services/api';

const PhoneList = ({ onSellPhone, refresh }) => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAvailablePhones = async () => {
    try {
      setLoading(true);
      const response = await phoneAPI.getAvailablePhones();
      if (response.success) {
        setPhones(response.data);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch phones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailablePhones();
  }, [refresh]);

  if (loading) {
    return (
      <div className="table-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading phones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-container">
        <div style={{ padding: '2rem', textAlign: 'center', color: '#dc3545' }}>
          <p>Error: {error}</p>
          <button 
            className="btn btn-primary" 
            onClick={fetchAvailablePhones}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (phones.length === 0) {
    return (
      <div className="table-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>No phones available in inventory</h3>
          <p>Register new phones to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Available Phones ({phones.length})</h2>
      </div>
      <table className="phone-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>IMEI</th>
            <th>Supplier</th>
            <th>Purchase Price</th>
            <th>Date In</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {phones.map(phone => (
            <tr key={phone.id}>
              <td>{phone.model}</td>
              <td>{phone.imei}</td>
              <td>{phone.supplier_name}</td>
             <td>₦{parseFloat(phone.purchase_price).toLocaleString()}</td>
              <td>{new Date(phone.date_in).toLocaleDateString()}</td>
              <td>
                <button 
                  className="btn btn-success"
                  onClick={() => onSellPhone(phone)}
                >
                  Sell Phone
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhoneList;