import React, { useState } from 'react';
import { phoneAPI } from '../services/api';
import Swal from 'sweetalert2';

const PhoneForm = ({ onPhoneAdded }) => {
  const [formData, setFormData] = useState({
    model: '',
    imei: '',
    supplierName: '',
    purchasePrice: '',
    dateIn: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const phoneData = {
        model: formData.model,
        imei: formData.imei,
        supplierName: formData.supplierName,
        purchasePrice: parseFloat(formData.purchasePrice),
        dateIn: formData.dateIn
      };

      const response = await phoneAPI.createPhone(phoneData);
      
      if (response.success) {
        // Reset form
        setFormData({
          model: '',
          imei: '',
          supplierName: '',
          purchasePrice: '',
          dateIn: new Date().toISOString().split('T')[0]
        });
        
        // Notify parent component
        if (onPhoneAdded) {
          onPhoneAdded(response.data);
        }
        
        // Show success alert
        Swal.fire({
          title: '<strong style="color: #28a745;">Phone Registered Successfully!</strong>',
          icon: 'success',
          html: `
            <div style="text-align: center; color: #333;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">📱</div>
              <h3 style="color: #667eea; margin-bottom: 0.5rem;">${response.data.model}</h3>
              <p style="margin: 0.25rem 0;"><strong>IMEI:</strong> ${response.data.imei}</p>
              <p style="margin: 0.25rem 0;"><strong>Supplier:</strong> ${response.data.supplier_name}</p>
              <p style="margin: 0.25rem 0;"><strong>Purchase Price:</strong> ₦${parseFloat(response.data.purchase_price).toLocaleString()}</p>
              <p style="margin: 0.25rem 0;"><strong>Date In:</strong> ${new Date(response.data.date_in).toLocaleDateString()}</p>
            </div>
          `,
          confirmButtonText: 'Great! 🎉',
          confirmButtonColor: '#667eea',
          background: '#ffffff',
          customClass: {
            popup: 'phone-registered-popup'
          }
        });
      }
    } catch (error) {
      setError(error.message || 'Failed to register phone');
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message || 'Failed to register phone',
        confirmButtonColor: '#dc3545',
        background: '#1a1a1a',
        color: '#ffffff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: '15px 15px 0 0',
        textAlign: 'center',
        margin: '-2rem -2rem 2rem -2rem',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
      }}>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '600' }}>Register New Phone</h2>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>Add a new phone to your inventory</p>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)', 
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              📱 Phone Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g., Iphone 13 Pro Max"
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                background: loading ? '#f8f9fa' : '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              🔢 IMEI Number
            </label>
            <input
              type="text"
              name="imei"
              value={formData.imei}
              onChange={handleChange}
              required
              placeholder="15-digit IMEI number"
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                background: loading ? '#f8f9fa' : '#ffffff',
                fontFamily: 'monospace'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              👤 Supplier Name
            </label>
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              required
              placeholder="Name of person you bought from"
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                background: loading ? '#f8f9fa' : '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              💰 Purchase Price (₦)
            </label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="0.00"
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                background: loading ? '#f8f9fa' : '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              📅 Date In
            </label>
            <input
              type="date"
              name="dateIn"
              value={formData.dateIn}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                background: loading ? '#f8f9fa' : '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div className="form-group button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: loading 
                  ? '#6c757d' 
                  : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading 
                  ? 'none' 
                  : '0 6px 20px rgba(40, 167, 69, 0.4)',
                transform: loading ? 'none' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid transparent', 
                    borderTop: '2px solid white', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }}></div>
                  Registering Phone...
                </div>
              ) : (
                '📱 Register Phone'
              )}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group.button-group {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-group.button-group {
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default PhoneForm;