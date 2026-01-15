import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../../contexts/TripContext';
import travelTypes from '../../data/travel_types.json';

export default function CreateTripScreen() {
  const router = useRouter();
  const { createTrip } = useTrips();

  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState('international');

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a trip name');
      return;
    }
    if (!country.trim()) {
      alert('Please enter a destination country');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please enter travel dates');
      return;
    }

    await createTrip({
      title: title.trim(),
      destination: {
        country: country.trim(),
        city: city.trim() || country.trim(),
      },
      startDate,
      endDate,
      type: selectedType,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Trip Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Tokyo Summer Trip"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#C7C7CC"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Destination *</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
          placeholderTextColor="#C7C7CC"
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="City (optional)"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#C7C7CC"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Travel Dates *</Text>
        <View style={styles.dateRow}>
          <View style={styles.dateInput}>
            <Text style={styles.dateLabel}>Start</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor="#C7C7CC"
            />
          </View>
          <View style={styles.dateInput}>
            <Text style={styles.dateLabel}>End</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor="#C7C7CC"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Travel Type</Text>
        <View style={styles.typeGrid}>
          {travelTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                selectedType === type.id && styles.typeCardSelected,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Ionicons
                name={type.icon}
                size={28}
                color={selectedType === type.id ? '#fff' : '#4A90D9'}
              />
              <Text
                style={[
                  styles.typeText,
                  selectedType === type.id && styles.typeTextSelected,
                ]}
              >
                {type.titleKo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  typeCardSelected: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  typeText: {
    fontSize: 12,
    color: '#1C1C1E',
    marginTop: 6,
    textAlign: 'center',
  },
  typeTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
