// JoinRoom.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const JoinRoom = () => {
    const { roomId, userId } = useParams();
    const [options, setOptions] = useState([]);
    const [selection, setSelection] = useState(null);
    const [reveal, setReveal] = useState(false);
    const [selections, setSelections] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Room ID:', roomId);
        console.log('User ID:', userId);

        const fetchRoomData = async () => {
            try {
                if (roomId) {
                    const roomDocRef = doc(db, 'rooms', roomId);
                    const roomDocSnap = await getDoc(roomDocRef);

                    if (roomDocSnap.exists()) {
                        const data = roomDocSnap.data();
                        console.log('Room Data:', data);

                        if (data && data.options) {
                            setOptions(data.options);
                        }
                        if (data && data.selections) {
                            setSelections(data.selections);
                            const allSelected = Object.keys(data.selections).length === data.friends.length;
                            setReveal(allSelected);
                        }
                    } else {
                        console.error('No such document!');
                        setError('No such room exists.');
                    }
                }
            } catch (err) {
                console.error('Error fetching room data:', err);
                setError('Failed to fetch room data.');
            }
        };

        fetchRoomData();
    }, [roomId]);

    const makeSelection = async (option) => {
        if (roomId && userId) {
            setSelection(option);
            const roomDocRef = doc(db, 'rooms', roomId);
            await updateDoc(roomDocRef, {
                [`selections.${userId}`]: option
            });
        }
    };

    return (
        <div>
            <h2>Join Room</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {options.length > 0 ? (
                <div>
                    <h2>Select an Option</h2>
                    {options.map((option, index) => (
                        <button key={index} onClick={() => makeSelection(option)}>{option}</button>
                    ))}
                </div>
            ) : (
                !error && <p>Loading options...</p>
            )}
            {reveal && (
                <div>
                    <h2>Selections Revealed</h2>
                    <ul>
                        {Object.keys(selections).map((id) => (
                            <li key={id}>{id}: {selections[id]}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default JoinRoom;
