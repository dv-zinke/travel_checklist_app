import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../../contexts/TripContext';
import categories from '../../data/categories.json';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { trips, toggleCheckItem, toggleImportant, addCustomItem, deleteCheckItem, deleteTrip, getProgress } = useTrips();

  const [expandedCategories, setExpandedCategories] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );
  const [newItemText, setNewItemText] = useState('');
  const [addingToCategory, setAddingToCategory] = useState(null);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  const progress = getProgress(id);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getCategoryItems = (categoryId) => {
    return trip.checklist.filter((item) => item.categoryId === categoryId);
  };

  const handleAddItem = async (categoryId) => {
    if (!newItemText.trim()) return;
    await addCustomItem(id, categoryId, newItemText.trim());
    setNewItemText('');
    setAddingToCategory(null);
  };

  const handleDeleteItem = (itemId, itemTitle) => {
    Alert.alert(
      'Delete Item',
      `Delete "${itemTitle}" from checklist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCheckItem(id, itemId),
        },
      ]
    );
  };

  const handleDeleteTrip = () => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${trip.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTrip(id);
            router.back();
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: trip.title }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={18} color="#fff" />
              <Text style={styles.headerText}>
                {trip.destination?.city}, {trip.destination?.country}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#fff" />
              <Text style={styles.headerText}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Text>
            </View>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressValue}>{progress}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
        </View>

        <View style={styles.checklistContainer}>
          {categories.map((category) => {
            const items = getCategoryItems(category.id);
            if (items.length === 0 && addingToCategory !== category.id) return null;

            const checkedCount = items.filter((i) => i.checked).length;
            const isExpanded = expandedCategories[category.id];

            return (
              <View key={category.id} style={styles.categorySection}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={styles.categoryLeft}>
                    <Ionicons name={category.icon} size={20} color="#4A90D9" />
                    <Text style={styles.categoryTitle}>{category.titleKo}</Text>
                    <Text style={styles.categoryCount}>
                      {checkedCount}/{items.length}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#8E8E93"
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.categoryContent}>
                    {items.map((item) => (
                      <View key={item.id} style={styles.checkItem}>
                        <TouchableOpacity
                          style={styles.checkbox}
                          onPress={() => toggleCheckItem(id, item.id)}
                        >
                          <Ionicons
                            name={item.checked ? 'checkbox' : 'square-outline'}
                            size={24}
                            color={item.checked ? '#34C759' : '#C7C7CC'}
                          />
                        </TouchableOpacity>
                        <Text
                          style={[
                            styles.itemText,
                            item.checked && styles.itemTextChecked,
                          ]}
                        >
                          {item.titleKo || item.title}
                        </Text>
                        <TouchableOpacity
                          style={styles.starButton}
                          onPress={() => toggleImportant(id, item.id)}
                        >
                          <Ionicons
                            name={item.important ? 'star' : 'star-outline'}
                            size={20}
                            color={item.important ? '#FFD60A' : '#C7C7CC'}
                          />
                        </TouchableOpacity>
                        {item.isCustom && (
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteItem(item.id, item.title)}
                          >
                            <Ionicons name="close-circle" size={20} color="#FF3B30" />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                    {addingToCategory === category.id ? (
                      <View style={styles.addItemRow}>
                        <TextInput
                          style={styles.addItemInput}
                          placeholder="New item..."
                          value={newItemText}
                          onChangeText={setNewItemText}
                          autoFocus
                          onSubmitEditing={() => handleAddItem(category.id)}
                        />
                        <TouchableOpacity
                          style={styles.addItemButton}
                          onPress={() => handleAddItem(category.id)}
                        >
                          <Ionicons name="checkmark" size={20} color="#34C759" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.addItemButton}
                          onPress={() => {
                            setAddingToCategory(null);
                            setNewItemText('');
                          }}
                        >
                          <Ionicons name="close" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setAddingToCategory(category.id)}
                      >
                        <Ionicons name="add" size={18} color="#4A90D9" />
                        <Text style={styles.addButtonText}>Add Item</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.deleteTrip} onPress={handleDeleteTrip}>
          <Ionicons name="trash" size={20} color="#FF3B30" />
          <Text style={styles.deleteTripText}>Delete Trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  header: {
    backgroundColor: '#4A90D9',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },
  checklistContainer: {
    padding: 16,
  },
  categorySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FAFAFA',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 10,
  },
  categoryCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  categoryContent: {
    padding: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  checkbox: {
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  itemTextChecked: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  starButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  addButtonText: {
    color: '#4A90D9',
    fontSize: 14,
    marginLeft: 6,
  },
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  addItemButton: {
    padding: 8,
    marginLeft: 4,
  },
  deleteTrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 40,
  },
  deleteTripText: {
    color: '#FF3B30',
    fontSize: 16,
    marginLeft: 8,
  },
});
