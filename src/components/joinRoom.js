// src/JoinRoom.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const JoinRoom = () => {
    const { roomId, userId } = useParams();
    const [options, setOptions] = useState([]);
    const [selection, setSelection] = useState(null);
    const [reveal, setReveal] = useState(false);
    const [selections, setSelections] = useState({});
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const roomDocRef = doc(db, 'rooms', roomId);

        const unsubscribe = onSnapshot(roomDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data && data.options) {
                    setOptions(data.options);
                }
                if (data && data.selections) {
                    setSelections(data.selections);
                    const allSelected = Object.keys(data.selections).length === data.friends.length;
                    setReveal(allSelected);
                }
                if (data && data.friends) {
                    setFriends(data.friends);
                }
            } else {
                setError('No such collaboration exists.');
            }
        });

        return () => unsubscribe();
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

    const getFriendNameById = (id) => {
        const friend = friends.find(friend => friend.id === id);
        return friend ? friend.name : id;
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Join Collaboration</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {options.length > 0 ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Select an Option</h2>
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => makeSelection(option)}
                                    className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 focus:outline-none mb-2"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center">Loading options...</p>
                    )}
                </div>
                {reveal && (
                    <div>
                        <h2 className="text-xl font-semibold mt-4">Selections Revealed</h2>
                        <ul className="list-disc pl-5 mt-2">
                            {Object.keys(selections).map((id) => (
                                <li key={id} className="mb-1">{getFriendNameById(id)}: {selections[id]}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JoinRoom;
