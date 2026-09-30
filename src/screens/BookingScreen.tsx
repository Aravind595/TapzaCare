import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Doctor, Slot, Booking} from '../types';
import {
  getDoctors,
  getSlots,
  createBooking,
} from '../services/mockApi';

interface Props {
  onBack: () => void;
}

const BookingScreen: React.FC<Props> = ({onBack}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] =
    useState<Slot | null>(null);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Android hardware back button
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onBack();
        return true;
      },
    );

    return () => subscription.remove();
  }, [onBack]);

  // Generate appointment dates
  useEffect(() => {
    const availableDates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const formattedDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');

      availableDates.push(formattedDate);
    }

    setDates(availableDates);
    setSelectedDate(availableDates[0]);
  }, []);

  // Load doctors
  useEffect(() => {
    let mounted = true;

    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await getDoctors();

        if (mounted) {
          setDoctors(response);
          setSelectedDoctor(response[0] ?? null);
        }
      } catch {
        if (mounted) {
          Alert.alert(
            'Error',
            'Unable to load doctors. Please try again.',
          );
        }
      } finally {
        if (mounted) {
          setLoadingDoctors(false);
        }
      }
    };

    loadDoctors();

    return () => {
      mounted = false;
    };
  }, []);

  // Load slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setSlots([]);
      return;
    }

    let mounted = true;

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setSelectedSlot(null);
        setSlots([]);

        const response = await getSlots(
          selectedDoctor.id,
          selectedDate,
        );

        if (mounted) {
          setSlots(response);
        }
      } catch {
        if (mounted) {
          setSlots([]);
          Alert.alert(
            'Error',
            'Unable to load slots. Please try again.',
          );
        }
      } finally {
        if (mounted) {
          setLoadingSlots(false);
        }
      }
    };

    loadSlots();

    return () => {
      mounted = false;
    };
  }, [selectedDoctor, selectedDate]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);

    return {
      day: date.toLocaleDateString('en-US', {
        weekday: 'short',
      }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', {
        month: 'short',
      }),
    };
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Confirm booking
  const handleBooking = async () => {
    if (!selectedDoctor) {
      Alert.alert('Select Doctor', 'Please select a doctor.');
      return;
    }

    if (!selectedSlot) {
      Alert.alert('Select Slot', 'Please select an available slot.');
      return;
    }

    try {
      setBookingLoading(true);

      const booking: Booking = await createBooking(
        selectedDoctor.id,
        selectedSlot.id,
      );

      setSlots(previous =>
        previous.filter(slot => slot.id !== booking.slotId),
      );

      setSelectedSlot(null);

      Alert.alert(
        'Booking Confirmed',
        `Your appointment with ${selectedDoctor.name} is confirmed.`,
        [
          {
            text: 'OK',
            onPress: onBack,
          },
        ],
      );
    } catch (error: unknown) {
      const bookingError = error as Error & {status?: number};

      if (bookingError.status === 409) {
        Alert.alert(
          'Slot Unavailable',
          'This slot has already been booked. Please select another slot.',
        );

        // Refresh slots after conflict
        try {
          const updatedSlots = await getSlots(
            selectedDoctor.id,
            selectedDate,
          );
          setSlots(updatedSlots);
        } catch {
          setSlots([]);
        }

        setSelectedSlot(null);
      } else {
        Alert.alert(
          'Booking Failed',
          bookingError instanceof Error
            ? bookingError.message
            : 'Please try again.',
        );
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading doctors
  if (loadingDoctors) {
    return (
      <SafeAreaView
        style={styles.center}
        edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Book Appointment
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Doctor selection */}
        <Text style={styles.sectionTitle}>
          Select Doctor
        </Text>

        {doctors.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No doctors available.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setLoadingDoctors(true);
                getDoctors()
                  .then(response => {
                    setDoctors(response);
                    setSelectedDoctor(response[0] ?? null);
                  })
                  .catch(() => {
                    Alert.alert(
                      'Error',
                      'Unable to load doctors.',
                    );
                  })
                  .finally(() => setLoadingDoctors(false));
              }}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          doctors.map(doctor => {
            const isSelected =
              selectedDoctor?.id === doctor.id;

            return (
              <TouchableOpacity
                key={doctor.id}
                style={[
                  styles.doctorCard,
                  isSelected && styles.selectedDoctorCard,
                ]}
                onPress={() => setSelectedDoctor(doctor)}
                accessibilityRole="button"
                accessibilityState={{selected: isSelected}}
                accessibilityLabel={`${doctor.name}, ${doctor.specialty}`}>

                <View style={styles.doctorAvatar}>
                  <Text style={styles.avatarText}>
                    {doctor.name
                      .replace('Dr. ', '')
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>

                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>
                    {doctor.name}
                  </Text>

                  <Text style={styles.specialty}>
                    {doctor.specialty}
                  </Text>

                  <Text style={styles.languages}>
                    {doctor.languages.join(' • ')}
                  </Text>

                  <Text style={styles.fee}>
                    ₹{doctor.feeInr}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    isSelected && styles.radioSelected,
                  ]}>
                  {isSelected && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Date selection */}
        <Text style={styles.sectionTitle}>
          Select Date
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}>
          {dates.map(date => {
            const formatted = formatDate(date);
            const isSelected = selectedDate === date;

            return (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateCard,
                  isSelected && styles.selectedDateCard,
                ]}
                onPress={() => setSelectedDate(date)}
                accessibilityRole="button"
                accessibilityState={{selected: isSelected}}
                accessibilityLabel={`${formatted.day}, ${formatted.date} ${formatted.month}`}>

                <Text
                  style={[
                    styles.dateDay,
                    isSelected && styles.selectedDateText,
                  ]}>
                  {formatted.day}
                </Text>

                <Text
                  style={[
                    styles.dateNumber,
                    isSelected && styles.selectedDateText,
                  ]}>
                  {formatted.date}
                </Text>

                <Text
                  style={[
                    styles.dateMonth,
                    isSelected && styles.selectedDateText,
                  ]}>
                  {formatted.month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Available slots */}
        <Text style={styles.sectionTitle}>
          Available Time Slots
        </Text>

        {loadingSlots ? (
          <View style={styles.slotLoading}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>
              Loading slots...
            </Text>
          </View>
        ) : slots.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No available slots for this date.
            </Text>
          </View>
        ) : (
          <View style={styles.slotGrid}>
            {slots.map(slot => {
              const isSelected =
                selectedSlot?.id === slot.id;

              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotButton,
                    isSelected && styles.selectedSlotButton,
                  ]}
                  onPress={() => setSelectedSlot(slot)}
                  accessibilityRole="button"
                  accessibilityState={{selected: isSelected}}
                  accessibilityLabel={formatTime(slot.startsAt)}>
                  <Text
                    style={[
                      styles.slotText,
                      isSelected && styles.selectedSlotText,
                    ]}>
                    {formatTime(slot.startsAt)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Booking summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Appointment Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Doctor</Text>
            <Text style={styles.summaryValue}>
              {selectedDoctor?.name ?? 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>
              {selectedDate || 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>
              {selectedSlot
                ? formatTime(selectedSlot.startsAt)
                : 'Not selected'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>
              Consultation Fee
            </Text>
            <Text style={styles.totalValue}>
              ₹{selectedDoctor?.feeInr ?? 0}
            </Text>
          </View>
        </View>

        {/* Confirm booking */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedDoctor ||
              !selectedSlot ||
              bookingLoading) &&
              styles.disabledButton,
          ]}
          disabled={
            !selectedDoctor ||
            !selectedSlot ||
            bookingLoading
          }
          onPress={handleBooking}
          accessibilityRole="button"
          accessibilityLabel="Confirm booking">

          {bookingLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.bookButtonText}>
              Confirm Booking
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 34,
    color: '#111827',
    lineHeight: 38,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
  },

  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  selectedDoctorCard: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  doctorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563EB',
  },

  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },

  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  specialty: {
    fontSize: 13,
    color: '#475569',
    marginTop: 3,
  },

  languages: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },

  fee: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 5,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: '#2563EB',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },

  dateList: {
    paddingBottom: 4,
  },

  dateCard: {
    width: 65,
    height: 86,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  selectedDateCard: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  dateDay: {
    fontSize: 12,
    color: '#64748B',
  },

  dateNumber: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 3,
  },

  dateMonth: {
    fontSize: 12,
    color: '#64748B',
  },

  selectedDateText: {
    color: '#FFFFFF',
  },

  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  slotButton: {
    width: '31%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 4,
  },

  selectedSlotButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  selectedSlotText: {
    color: '#FFFFFF',
  },

  slotLoading: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  loadingText: {
    color: '#64748B',
    marginTop: 8,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 12,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    maxWidth: '60%',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2563EB',
  },

  bookButton: {
    minHeight: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.5,
  },

  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default BookingScreen;