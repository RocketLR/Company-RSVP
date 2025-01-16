"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from '@/components/LoginForm';

const AdminPage: React.FC = () => {
  interface RSVP {
    name: string;
    attending: boolean;
    starter: string;
    mainCourse: string;
    dessert: string;
  }

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedTimestamp = localStorage.getItem('authTimestamp');
    const currentTime = new Date().getTime();

    if (savedAuth === 'true' && savedTimestamp && currentTime - parseInt(savedTimestamp) < 24 * 60 * 60 * 1000) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authTimestamp');
    }

    const fetchRSVPs = async () => {
      const response = await fetch('/api/rsvps');
      const data = await response.json();
      setRsvps(data);
    };

    fetchRSVPs();
  }, []);

  const calculateTotals = (items: RSVP[]) => {
    const totals = {
      starters: {} as Record<string, number>,
      mains: {} as Record<string, number>,
      desserts: {} as Record<string, number>,
    };

    items.forEach((rsvp) => {
      if (rsvp.starter) {
        totals.starters[rsvp.starter] = (totals.starters[rsvp.starter] || 0) + 1;
      }
      if (rsvp.mainCourse) {
        totals.mains[rsvp.mainCourse] = (totals.mains[rsvp.mainCourse] || 0) + 1;
      }
      if (rsvp.dessert) {
        totals.desserts[rsvp.dessert] = (totals.desserts[rsvp.dessert] || 0) + 1;
      }
    });

    return totals;
  };

  const handleDelete = async (name: string) => {
    await fetch('/api/rsvps', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    setRsvps(rsvps.filter(rsvp => rsvp.name !== name));
  };

  const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        if (rememberMe) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('authTimestamp', new Date().getTime().toString());
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('An error occurred during login');
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const totals = calculateTotals(rsvps);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Admin - RSVP Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <p>No RSVPs submitted yet.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Attending</th>
                  <th className="px-4 py-2">Starter</th>
                  <th className="px-4 py-2">Main Course</th>
                  <th className="px-4 py-2">Dessert</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="px-4 py-2">{rsvp.name}</td>
                    <td className="px-4 py-2">{rsvp.attending ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2">{rsvp.starter}</td>
                    <td className="px-4 py-2">{rsvp.mainCourse}</td>
                    <td className="px-4 py-2">{rsvp.dessert}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(rsvp.name)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Summary of Selections</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold">Starters</h3>
          <ul>
            {Object.entries(totals.starters).map(([starter, count]) => (
              <li key={starter}>{starter}: {count}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Main Courses</h3>
          <ul>
            {Object.entries(totals.mains).map(([main, count]) => (
              <li key={main}>{main}: {count}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Desserts</h3>
          <ul>
            {Object.entries(totals.desserts).map(([dessert, count]) => (
              <li key={dessert}>{dessert}: {count}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
