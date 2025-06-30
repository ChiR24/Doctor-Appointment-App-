import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Booking } from '@/store/slices/bookingsSlice';

const BookingCard = ({ booking }: { booking: Booking }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Appointment with {booking.doctor.name}</Text>
        <Text>Specialty: {booking.doctor.specialty}</Text>
        <Text>Time: {booking.time}</Text>
    </View>
);

export default function BookingsScreen() {
    const { bookings } = useSelector((state: RootState) => state.bookings);

    if (bookings.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>You have no bookings.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                renderItem={({ item }) => <BookingCard booking={item} />}
                keyExtractor={(item, index) => `${item.doctor.id}-${item.time}-${index}`}
                contentContainerStyle={{ padding: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
