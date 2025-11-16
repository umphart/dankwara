import React, { useState, useEffect } from 'react';
import SalesForm from '../components/SalesForm';
import PhoneList from '../components/PhoneList';
import Swal from 'sweetalert2';

const Sales = () => {
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  const handleSaleCompleted = () => {
    // Refresh the phone list and go back to selection
    setRefreshList(prev => prev + 1);
    setSelectedPhone(null);

    // SweetAlert instead of alert()
    Swal.fire({
      icon: 'success',
      title: 'Sale Completed!',
      text: 'The phone sale was successful.',
      confirmButtonColor: 'black',
      timer: 2000,
    });
  };

  if (selectedPhone) {
    return (
      <div>
        <button 
          className="btn" 
          onClick={() => setSelectedPhone(null)}
          style={{ marginBottom: '1rem' }}
        >
          ← Back to Phone Selection
        </button>
        <SalesForm 
          phone={selectedPhone} 
          onSaleCompleted={handleSaleCompleted}
        />
      </div>
    );
  }

  return (
    <div>
      <h1>Phone Sales</h1>
      <PhoneList 
        onSellPhone={setSelectedPhone} 
        refresh={refreshList}
      />
    </div>
  );
};

export default Sales;
