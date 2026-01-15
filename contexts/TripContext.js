import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateChecklist } from '../utils/checklistGenerator';

const TripContext = createContext();

const STORAGE_KEY = '@travel_checklist_trips';

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTrips(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTrips = async (newTrips) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTrips));
      setTrips(newTrips);
    } catch (error) {
      console.error('Failed to save trips:', error);
    }
  };

  const createTrip = async (tripData) => {
    const newTrip = {
      id: `trip_${Date.now()}`,
      ...tripData,
      checklist: generateChecklist(tripData.type),
      createdAt: new Date().toISOString(),
    };
    const newTrips = [...trips, newTrip];
    await saveTrips(newTrips);
    return newTrip;
  };

  const updateTrip = async (tripId, updates) => {
    const newTrips = trips.map((trip) =>
      trip.id === tripId ? { ...trip, ...updates } : trip
    );
    await saveTrips(newTrips);
  };

  const deleteTrip = async (tripId) => {
    const newTrips = trips.filter((trip) => trip.id !== tripId);
    await saveTrips(newTrips);
  };

  const toggleCheckItem = async (tripId, itemId) => {
    const newTrips = trips.map((trip) => {
      if (trip.id !== tripId) return trip;
      const newChecklist = trip.checklist.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      return { ...trip, checklist: newChecklist };
    });
    await saveTrips(newTrips);
  };

  const toggleImportant = async (tripId, itemId) => {
    const newTrips = trips.map((trip) => {
      if (trip.id !== tripId) return trip;
      const newChecklist = trip.checklist.map((item) =>
        item.id === itemId ? { ...item, important: !item.important } : item
      );
      return { ...trip, checklist: newChecklist };
    });
    await saveTrips(newTrips);
  };

  const addCustomItem = async (tripId, categoryId, title) => {
    const newItem = {
      id: `custom_${Date.now()}`,
      title,
      categoryId,
      checked: false,
      important: false,
      isCustom: true,
    };
    const newTrips = trips.map((trip) => {
      if (trip.id !== tripId) return trip;
      return { ...trip, checklist: [...trip.checklist, newItem] };
    });
    await saveTrips(newTrips);
  };

  const deleteCheckItem = async (tripId, itemId) => {
    const newTrips = trips.map((trip) => {
      if (trip.id !== tripId) return trip;
      const newChecklist = trip.checklist.filter((item) => item.id !== itemId);
      return { ...trip, checklist: newChecklist };
    });
    await saveTrips(newTrips);
  };

  const getProgress = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || !trip.checklist.length) return 0;
    const checked = trip.checklist.filter((item) => item.checked).length;
    return Math.round((checked / trip.checklist.length) * 100);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        createTrip,
        updateTrip,
        deleteTrip,
        toggleCheckItem,
        toggleImportant,
        addCustomItem,
        deleteCheckItem,
        getProgress,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
