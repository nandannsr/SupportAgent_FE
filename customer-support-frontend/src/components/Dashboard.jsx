import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch('http://localhost:8000/api/customers/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    };

    fetchCustomers();
  }, [authToken]);

  const handleCustomerClick = (customerId) => {
    navigate(`/chat/${customerId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Customer Dashboard</h2>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <ul className="space-y-2">
          {customers.map((customer) => (
            <li 
              key={customer.id} 
              className="border p-2 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => handleCustomerClick(customer.id)}
            >
              <p className="font-semibold">{customer.name || `Customer ${customer.id}`}</p>
              <p className="text-sm text-gray-600">{customer.phone_number}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
