import React, { useState } from 'react';
import { salesAPI } from '../services/api';
import Swal from 'sweetalert2';
import logo from "../logo/dk.png";

const SalesForm = ({ phone, onSaleCompleted }) => {
  const [saleData, setSaleData] = useState({
    salePrice: '',
    customerName: '',
    dateOut: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    console.log("Submitting sale for phone:", phone);
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const saleInfo = {
        phoneId: phone.id,
        salePrice: parseFloat(saleData.salePrice),
        customerName: saleData.customerName,
        dateOut: saleData.dateOut
      };

      const response = await salesAPI.createSale(saleInfo);
      if (response.success) {
        // Reset form
        setSaleData({
          salePrice: '',
          customerName: '',
          dateOut: new Date().toISOString().split('T')[0]
        });
        
        // Notify parent component
        if (onSaleCompleted) {
          onSaleCompleted(response.data);
        }
        
        // Show success alert with receipt
        showReceipt(response.data, phone);
      }
    } catch (error) {
      setError(error.message || 'Failed to complete sale');
      Swal.fire({
        icon: 'error',
        title: 'Sale Failed',
        text: error.message || 'Failed to complete sale',
        confirmButtonColor: '#dc3545',
        background: '#1a1a1a',
        color: '#ffffff'
      });
    } finally {
      setLoading(false);
    }
  };

  const showReceipt = (saleData, phoneData) => {
    const receiptNumber = "DK-" + Date.now(); // Auto-generate receipt number

    Swal.fire({
      title: '<strong style="color: black;">Sale Completed</strong>',
      icon: 'success',
      width: '480px',
      html: `
        <div style="text-align: left; color: black;">

          <!-- Logo -->
          <div style="text-align:center; margin-bottom:15px;">
            <img src="${logo}" alt="Logo" style="width:90px; opacity:0.9;"/>
          </div>

          <!-- Receipt Number -->
          <h3 style="text-align:center; margin-bottom:10px; font-size:18px;">
            RECEIPT NO: <span style="font-weight:bold;">${receiptNumber}</span>
          </h3>

          <hr/>

          <!-- Phone Details -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:15px; font-size:14px;">
            <div><strong>Phone Model:</strong><br/>${phoneData.model}</div>
            <div><strong>IMEI:</strong><br/>${phoneData.imei}</div>
            <div><strong>Customer Name:</strong><br/>${saleData.customer_name}</div>
            <div><strong>Sale Date:</strong><br/>${new Date(saleData.date_out).toLocaleDateString()}</div>
          </div>

          <hr style="margin-top:15px;"/>

          <!-- Sale Price Only -->
          <div style="margin-top:10px;">
            <div style="display:flex; justify-content:space-between; padding:5px 0; font-size:16px; font-weight:bold;">
              <span>Sale Price:</span>
              <span>₦${parseFloat(saleData.sale_price).toLocaleString()}</span>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: '🖨️ Print Receipt',
      confirmButtonColor: 'black',
      background: '#ffffff'
    }).then(result => {
      if (result.isConfirmed) {
        const w = window.open('', '_blank');

        w.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 40px; 
                  color: black;
                  position: relative;
                }

                .watermark {
                  position: fixed;
                  top: 40%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 60px;
                  font-weight: bold;
                  color: rgba(0,0,0,0.08);
                  z-index: -1;
                  user-select: none;
                }

                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }

                table { width: 100%; margin-top: 20px; font-size: 14px; }
                td { padding: 6px 0; }
                .sale-price { 
                  font-size: 18px; 
                  font-weight: bold; 
                  text-align: center; 
                  margin-top: 20px;
                  padding: 10px;
                  border-top: 2px solid #000;
                }
              </style>
            </head>

            <body>

              <div class="watermark">DANKWARA</div>

              <div class="header">
                <img src="${logo}" style="width:110px;" />
                <h2>DANKWARA PHONE SALES</h2>
                <h4>RECEIPT</h4>
                <p><strong>Receipt No:</strong> ${receiptNumber}</p>
              </div>

              <table>
                <tr><td><strong>Phone Model:</strong></td><td>${phoneData.model}</td></tr>
                <tr><td><strong>IMEI:</strong></td><td>${phoneData.imei}</td></tr>
                <tr><td><strong>Customer Name:</strong></td><td>${saleData.customer_name}</td></tr>
                <tr><td><strong>Sale Date:</strong></td><td>${new Date(saleData.date_out).toLocaleDateString()}</td></tr>
              </table>

              <div class="sale-price">
                Sale Price: ₦${parseFloat(saleData.sale_price).toLocaleString()}
              </div>

              <script>
                window.print();
                setTimeout(() => window.close(), 1200);
              </script>

            </body>
          </html>
        `);

        w.document.close();
      }
    });
  };

  const handleChange = (e) => {
    setSaleData({
      ...saleData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: '15px 15px 0 0',
        textAlign: 'center',
        margin: '-2rem -2rem 2rem -2rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600' }}>Sell Phone</h2>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>{phone.model}</p>
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

      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', 
        borderRadius: '12px',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <strong style={{ color: '#667eea', display: 'block', marginBottom: '0.25rem' }}>IMEI:</strong>
            <span style={{ color: '#555', fontFamily: 'monospace' }}>{phone.imei}</span>
          </div>
          <div>
            <strong style={{ color: '#667eea', display: 'block', marginBottom: '0.25rem' }}>Purchase Price:</strong>
            <span style={{ color: '#555', fontWeight: '600' }}>₦{parseFloat(phone.purchase_price).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem' }}>Sale Price (₦)</label>
            <input
              type="number"
              name="salePrice"
              value={saleData.salePrice}
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
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem' }}>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={saleData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
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
          
          <div className="form-group full-width">
            <label style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.5rem' }}>Sale Date</label>
            <input
              type="date"
              name="dateOut"
              value={saleData.dateOut}
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
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            background: loading 
              ? '#6c757d' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading 
              ? 'none' 
              : '0 6px 20px rgba(102, 126, 234, 0.4)',
            transform: loading ? 'none' : 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
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
              Processing Sale...
            </div>
          ) : (
            '🚀 Complete Sale'
          )}
        </button>
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
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesForm;