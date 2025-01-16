/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from './ui/input'
import { Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue, } from './ui/select'

const DinnerRSVPForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    attending: 'yes',
    starter: '',
    mainCourse: '',
    dessert: '',
    drinkAlcohol: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const switchRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const starters = [
    "Toast Skagen (Swedish shrimp salad with toast, caviar and lemon)",
    "Movitz gin&dill gravade lax (Homemade dillcured salmon)",
    "So Cheesy (Grilled chèvre on sourdough)",
    "Dagens Soppa (Soup of the day)",
    "Tricolore Caprese",
    "Ost och Chark För 2",
  ];

  const mains = [
    "Coeur de Filét Provencale (Beef tenderloin)",
    "Sweet Meat (Grilled entrecôte)",
    "Lammracks á la Movitz",
    "Helstekt Renytterfilé (Filet of reindeer)",
    "Movitz Surf 'n' Turf",
    "Husets Köttbullar (Swedish meatballs)",
    "Halstrad Lax (Grilled salmon)",
    "Ungsbakad Hälleflundra (Baked halibut)",
    "Symphony Movitz (Seafood in tomato sauce)",
    "Pasta Movitz (Creamy linguine with scampi)",
    "Pasta Frutti Di Mare (Seafood pasta)",
    "Pasta Gorgonzola (Pasta with gorgonzola cheese)",
    "Pasta Delizie (Pasta filled with ricotta and spinach in tomato sauce)",
  ];

  const desserts = [
    "Knäckig Paj (Pie with vanilla ice cream)",
    "Hjortronparfait (Cloudberry parfait)",
    "Movitz Frescha (Baked fruit with white chocolate)",
    "Inas Chokladbrownie",
    "Sorbet (Raspberry or lemon)",
    "Osttalrik (Cheese plate)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your server
    // For demo purposes, we'll just log it and show a success message
    console.log('Form submitted:', formData);
    
    // Send data to the server
    const response = await fetch('/api/rsvps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
        Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
      );
      if (distance < 50) {
        const angle = Math.atan2(
          e.clientY - (rect.top + rect.height / 2),
          e.clientX - (rect.left + rect.width / 2)
        );
        switchRef.current.style.transform = `translate(${Math.cos(angle) * 50}px, ${Math.sin(angle) * 50}px)`;
      } else {
        switchRef.current.style.transform = 'translate(0, 0)';
      }
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    if (!checked) {
      const confirmNoAlcohol = window.confirm("Are you sure you don't want to drink alcohol?");
      if (!confirmNoAlcohol) {
        return;
      }
    }
    setFormData(prev => ({ ...prev, drinkAlcohol: checked }));
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal();
  };

  if (submitted) {
    return (
      <Alert className="max-w-2xl mx-auto my-8">
        <AlertDescription>
          Thank you for your response! Your RSVP has been recorded. An email confirmation will be sent shortly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Company Dinner RSVP</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Name</label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Will you attend?</label>
            <Select
              onValueChange={(value) => handleSelectChange('attending', value)}
              value={formData.attending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="yes">Yes, I'll be there</SelectItem>
                  <SelectItem value="no">No, I can't make it</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {formData.attending === 'yes' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Starter</label>
                <Select
                  onValueChange={(value) => handleSelectChange('starter', value)}
                  value={formData.starter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a starter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {starters.map((starter) => (
                        <SelectItem key={starter} value={starter}>
                          {starter}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Main Course</label>
                <Select
                  onValueChange={(value) => handleSelectChange('mainCourse', value)}
                  value={formData.mainCourse}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a main course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mains.map((main) => (
                        <SelectItem key={main} value={main}>
                          {main}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Dessert</label>
                <Select
                  onValueChange={(value) => handleSelectChange('dessert', value)}
                  value={formData.dessert}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a dessert" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {desserts.map((dessert) => (
                        <SelectItem key={dessert} value={dessert}>
                          {dessert}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Will you drink alcohol?</label>
            <div
              ref={switchRef}
              onMouseMove={handleMouseMove}
              className="inline-block"
            >
              <Switch
                checked={formData.drinkAlcohol}
                onCheckedChange={handleSwitchChange}
              />
              <span>{formData.drinkAlcohol ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <Button variant="secondary" onClick={handleOpenModal} className="mt-4 p-2 bg-blue-500 text-white rounded">View Menu</Button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit RSVP
          </button>
        </form>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">
              <button onClick={closeModal} className="mb-4 p-2 bg-red-500 text-white rounded">Close</button>
              <iframe src="/movitz-menu.pdf" width="600" height="800"></iframe>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DinnerRSVPForm;