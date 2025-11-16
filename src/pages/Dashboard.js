import React, { useState, useEffect } from 'react';
import { phoneAPI, salesAPI } from '../services/api';

const Dashboard = () => {
  const [phoneStats, setPhoneStats] = useState({});
  const [recentSales, setRecentSales] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [phoneStatsRes, recentSalesRes, recentPurchasesRes] = await Promise.all([
        phoneAPI.getPhoneStats(),
        salesAPI.getRecentSales(50), // Get more sales to calculate today's stats
        phoneAPI.getAllPhones() // Get all phones to calculate today's purchases
      ]);

      if (phoneStatsRes.success) setPhoneStats(phoneStatsRes.data);
      if (recentSalesRes.success) setRecentSales(recentSalesRes.data);
      if (recentPurchasesRes.success) setRecentPurchases(recentPurchasesRes.data);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate today's sales
  const getTodaySales = () => {
    const today = new Date().toDateString();
    return recentSales.filter(sale => 
      new Date(sale.date_out).toDateString() === today
    ).length;
  };

  // Calculate today's purchases
  const getTodayPurchases = () => {
    const today = new Date().toDateString();
    return recentPurchases.filter(phone => 
      new Date(phone.date_in).toDateString() === today
    ).length;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h1>Dashboard</h1>
        <div className="loading-spinner-container">
          <div className="loading-spinner-large"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const todaySales = getTodaySales();
  const todayPurchases = getTodayPurchases();

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      
      {/* Inventory Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">{phoneStats.total_phones || 0}</div>
            <div className="stat-label">Total Phones</div>
            <div className="stat-subtext">In inventory</div>
          </div>
        </div>
        
        <div className="stat-card available-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <div className="stat-number">{phoneStats.available_phones || 0}</div>
            <div className="stat-label">Available Phones</div>
            <div className="stat-subtext">Ready to sell</div>
          </div>
        </div>
        
        <div className="stat-card sold-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{phoneStats.sold_phones || 0}</div>
            <div className="stat-label">Total Sold Phones</div>
            <div className="stat-subtext">All time sales</div>
          </div>
        </div>

        <div className="stat-card purchase-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <div className="stat-number">{todayPurchases}</div>
            <div className="stat-label">Today's Purchase</div>
            <div className="stat-subtext">Phones bought today</div>
          </div>
        </div>

        <div className="stat-card today-sales-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">{todaySales}</div>
            <div className="stat-label">Today's Sales</div>
            <div className="stat-subtext">Phones sold today</div>
          </div>
        </div>

        <div className="stat-card total-purchase-card">
          <div className="stat-icon">📥</div>
          <div className="stat-content">
            <div className="stat-number">{recentPurchases.length || 0}</div>
            <div className="stat-label">Total Purchase</div>
            <div className="stat-subtext">All time purchases</div>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>Recent Sales</h2>
        </div>
        {recentSales.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Sales Recorded Yet</h3>
            <p>Start selling phones to see transactions here</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="phone-table">
              <thead>
                <tr>
                  <th>Phone Model</th>
                  <th>Customer</th>
                  <th>Sale Date</th>
                  <th>Sale Price</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.slice(0, 10).map(sale => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard {
          padding: 1rem;
        }

        .dashboard h1 {
          color: #333;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          text-align: center;
        }

        .dashboard-loading {
          text-align: center;
          padding: 2rem;
        }

        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .loading-spinner-large {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .total-card {
          border-left: 4px solid #667eea;
        }

        .available-card {
          border-left: 4px solid #28a745;
        }

        .sold-card {
          border-left: 4px solid #ff6b6b;
        }

        .purchase-card {
          border-left: 4px solid #ffd93d;
        }

        .today-sales-card {
          border-left: 4px solid #6c5ce7;
        }

        .total-purchase-card {
          border-left: 4px solid #00b894;
        }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #666;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .stat-subtext {
          color: #888;
          font-size: 0.8rem;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .table-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.3rem;
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

        .empty-state h3 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Tablet and larger */
        @media (min-width: 768px) {
          .dashboard {
            padding: 2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard h1 {
            text-align: left;
            font-size: 2rem;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .stat-card {
            padding: 1rem;
            gap: 0.75rem;
          }

          .stat-icon {
            font-size: 2rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .table-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;