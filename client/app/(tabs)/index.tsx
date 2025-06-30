import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View, Button, ActivityIndicator, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from '@/store/slices/doctorsSlice';
import { addBooking } from '@/store/slices/bookingsSlice';
import { RootState, AppDispatch } from '@/store/store';
import { Doctor } from '@/store/slices/doctorsSlice';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

const DoctorCard = ({ doctor, onBook }: { doctor: Doctor, onBook: (doctor: Doctor) => void }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{doctor.name}</Text>
        <Text>{doctor.specialty}</Text>
        <Text style={{ color: doctor.availability === 'available' ? 'green' : 'red' }}>
            {doctor.availability}
        </Text>
        <Button title="Book Appointment" onPress={() => onBook(doctor)} disabled={doctor.availability === 'unavailable'}/>
    </View>
);

export default function DoctorsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { doctors, loading, error } = useSelector((state: RootState) => state.doctors);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [slots, setSlots] = useState<{ time: string, isBooked: boolean }[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchDoctors());
    }, [dispatch]);

    const handleBookPress = async (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        try {
            const response = await axios.get(`${API_BASE_URL}/doctors/${doctor.id}/slots`);
            setSlots(response.data);
            setModalVisible(true);
        } catch (e) {
            console.error("Failed to fetch time slots", e);
        }
    };

    const handleSelectSlot = async (time: string) => {
        if (!selectedDoctor) return;
    
        try {
            await axios.post(`${API_BASE_URL}/book`, {
                doctorId: selectedDoctor.id,
                time: time,
            });
            dispatch(addBooking({ doctor: selectedDoctor, time }));
            setModalVisible(false);
            // Re-fetch doctors to update availability
            dispatch(fetchDoctors());
        } catch (e) {
            console.error("Failed to book appointment", e);
            alert("Failed to book appointment. The slot may have been taken.");
        }
    };

    if (loading === 'pending') {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    if (error) {
        return <Text style={styles.centered}>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={doctors}
                renderItem={({ item }) => <DoctorCard doctor={item} onBook={handleBookPress} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 10 }}
            />
             <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Available Slots for {selectedDoctor?.name}</Text>
                        {slots.map((slot) => (
                            <TouchableOpacity
                                key={slot.time}
                                style={[styles.slotButton, slot.isBooked ? styles.slotButtonDisabled : {}]}
                                onPress={() => handleSelectSlot(slot.time)}
                                disabled={slot.isBooked}
                            >
                                <Text style={styles.slotButtonText}>{slot.time}</Text>
                            </TouchableOpacity>
                        ))}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    slotButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginVertical: 5,
        width: 200,
        alignItems: 'center'
    },
    slotButtonDisabled: {
        backgroundColor: '#cccccc',
    },
    slotButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    buttonClose: {
        backgroundColor: "#f44336",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});
