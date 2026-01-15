import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../../contexts/TripContext';

export default function HomeScreen() {
  const router = useRouter();
  const { trips, loading, getProgress } = useTrips();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderTripItem = ({ item }) => {
    const progress = getProgress(item.id);
    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => router.push(`/trip/${item.id}`)}
      >
        <View style={styles.tripHeader}>
          <Text style={styles.tripTitle}>{item.title}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>
        <View style={styles.tripInfo}>
          <Ionicons name="location" size={16} color="#8E8E93" />
          <Text style={styles.tripInfoText}>
            {item.destination?.city}, {item.destination?.country}
          </Text>
        </View>
        <View style={styles.tripInfo}>
          <Ionicons name="calendar" size={16} color="#8E8E93" />
          <Text style={styles.tripInfoText}>
            {formatDate(item.startDate)} - {formatDate(item.endDate)}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="airplane-outline" size={80} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No Trips Yet</Text>
          <Text style={styles.emptyText}>
            Create your first trip to start{'\n'}organizing your travel checklist!
          </Text>
        </View>
      ) : (
        <FlatList
          data={trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/trip/create')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  progressContainer: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripInfoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#8E8E93',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});
