import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {getPrescriptions} from '../services/mockApi';
import {Prescription} from '../types';

interface Props {
  onBack: () => void;
}

interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const PrescriptionsScreen = ({onBack}: Props) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await getPrescriptions();

      setPrescriptions(response);

      const medicineList: MedicineItem[] = response.flatMap(
        prescription =>
          prescription.medicines.flatMap(medicine =>
            medicine.timing.map(time => ({
              id: `${prescription.id}-${medicine.id}-${time}`,
              name: medicine.name,
              dosage: medicine.dose,
              time: time.charAt(0).toUpperCase() + time.slice(1),
              taken: false,
            })),
          ),
      );

      setMedicines(medicineList);
    } catch {
  setError(true);
} finally {
  setLoading(false);
}
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const toggleMedicine = (id: string) => {
    setMedicines(current =>
      current.map(medicine =>
        medicine.id === id
          ? {...medicine, taken: !medicine.taken}
          : medicine,
      ),
    );
  };

  const takenCount = medicines.filter(medicine => medicine.taken).length;

  const progress =
    medicines.length > 0 ? (takenCount / medicines.length) * 100 : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading prescriptions...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={styles.backButton}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Prescriptions</Text>
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>
            Unable to load prescriptions
          </Text>

          <Text style={styles.emptyText}>
            Please check your connection and try again.
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={loadPrescriptions}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.backButton}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Prescriptions</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Today's Medicines</Text>

        {prescriptions.length > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Today's Progress</Text>

            <Text style={styles.progressCount}>
              {takenCount} of {medicines.length} doses taken
            </Text>

            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: 100,
                now: Math.round(progress),
              }}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${progress}%`},
                ]}
              />
            </View>
          </View>
        )}

        {medicines.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No prescriptions found
            </Text>

            <Text style={styles.emptyText}>
              Your prescribed medicines will appear here.
            </Text>
          </View>
        ) : (
          medicines.map(medicine => (
            <View key={medicine.id} style={styles.card}>
              <View style={styles.details}>
                <Text style={styles.name}>{medicine.name}</Text>

                <Text style={styles.subtitle}>{medicine.dosage}</Text>

                <View style={styles.timeBadge}>
                  <Text style={styles.time}>{medicine.time}</Text>
                </View>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={
                  medicine.taken
                    ? `Mark ${medicine.name} as not taken`
                    : `Mark ${medicine.name} as taken`
                }
                accessibilityState={{selected: medicine.taken}}
                style={[
                  styles.button,
                  medicine.taken && styles.takenButton,
                ]}
                onPress={() => toggleMedicine(medicine.id)}>
                <Text style={styles.buttonText}>
                  {medicine.taken ? 'Taken ✓' : 'Mark Taken'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {prescriptions.map(prescription => (
          <View key={prescription.id} style={styles.doctorCard}>
            <Text style={styles.doctorTitle}>
              Prescription Details
            </Text>

            <Text style={styles.doctorName}>
              {prescription.doctorName}
            </Text>

            <Text style={styles.clinic}>
              {prescription.clinicName}
            </Text>

            <Text style={styles.issued}>
              Issued on: {prescription.issuedAt}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  loadingText: {
    color: '#64748B',
    marginTop: 12,
    fontSize: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },

  backButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginRight: 12,
  },

  back: {
    color: '#2563EB',
    fontSize: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },

  progressCount: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 12,
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },

  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  details: {
    flex: 1,
    marginRight: 10,
  },

  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },

  timeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 8,
  },

  time: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#2563EB',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  takenButton: {
    backgroundColor: '#16A34A',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#2563EB',
    minHeight: 44,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },

  doctorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },

  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  clinic: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  issued: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
});

export default PrescriptionsScreen;