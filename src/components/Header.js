import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out',
          timer: 2000
        });
      }
    });
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <span className="brand-icon">📱</span>
          Dankwara Phone Sales
        </div>
        
        <div className="nav-section">
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/inventory" 
              className={`nav-link ${location.pathname === '/inventory' ? 'active' : ''}`}
            >
              Inventory
            </Link>
            <Link 
              to="/sales" 
              className={`nav-link ${location.pathname === '/sales' ? 'active' : ''}`}
            >
              Sales
            </Link>
          </div>
          
          <div className="user-section">
            <span className="user-info">
              👤 {user?.name}
            </span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .nav-brand {
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-icon {
          font-size: 1.8rem;
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          transition: background-color 0.3s;
          font-weight: 500;
        }

        .nav-link:hover {
          background-color: rgba(255,255,255,0.2);
        }

        .nav-link.active {
          background-color: rgba(255,255,255,0.3);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
        }

        .user-info {
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .logout-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .nav {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .nav-section {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-links {
            justify-content: center;
          }
          
          .user-section {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;