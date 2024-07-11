// src/CreateRoom.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const CreateRoom = () => {
    const [options, setOptions] = useState(['']);
    const [friends, setFriends] = useState([{ name: '', id: uuidv4() }]);
    const [roomId, setRoomId] = useState('');
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [allAnswered, setAllAnswered] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (roomId) {
                const roomRef = doc(db, 'rooms', roomId);
                const unsubscribe = onSnapshot(roomRef, (doc) => {
                    if (doc.exists()) {
                        setRoomData(doc.data());
                        checkAllAnswered(doc.data());
                    } else {
                        setRoomData(null);
                    }
                });
                return unsubscribe;
            }
        };

        fetchData();
    }, [roomId]);

    const checkAllAnswered = (data) => {
        const { friends, selections } = data;
        const allAnswered = friends.every(friend => selections[friend.id]);
        setAllAnswered(allAnswered);
    };

    const handleAddOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);
        } else {
            setError('You can add up to 5 options.');
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddFriend = () => {
        if (friends.length < 5) {
            const newFriend = { name: '', id: uuidv4() };
            setFriends([...friends, newFriend]);
            const newLink = `${window.location.origin}/join/${roomId}/${newFriend.id}`;
            setLinks([...links, { friend: newFriend, link: newLink }]);
        } else {
            setError('You can add up to 5 friends.');
        }
    };

    const handleFriendChange = (index, value) => {
        const newFriends = [...friends];
        newFriends[index].name = value;
        setFriends(newFriends);
    };

    const handleCreateRoom = async () => {
        if (options.length === 0) {
            setError('Please add at least one option.');
            return;
        }
        const id = uuidv4();
        setRoomId(id);
        const roomData = {
            roomId: id,
            options: options.filter(option => option.trim() !== ''),
            selections: {},
            friends: friends.filter(friend => friend.name.trim() !== '')
        };
        await setDoc(doc(db, 'rooms', id), roomData);
        const friendLinks = roomData.friends.map(friend => ({
            friend,
            link: `${window.location.origin}/join/${id}/${friend.id}`
        }));
        setLinks(friendLinks);
    };

    const handleResultDisplay = () => {
        if (roomData) {
            const { friends, selections } = roomData;
            return (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Results:</h3>
                    {friends.map(friend => (
                        <p key={friend.id} className="mb-2">
                            {friend.name}: {selections[friend.id] || 'No answer yet'}
                        </p>
                    ))}
                </div>
            );
        }
    };

    const handleShareLink = async (link) => {
        if (navigator.share) {
            try {
                await navigator.share({ url: link });
            } catch (error) {
                console.error('Error sharing link:', error);
                // Handle error (e.g., show a message to the user)
            }
        } else {
            // Fallback for browsers/devices that do not support navigator.share
            console.warn('Web Share API not supported.');
            // Optionally provide a fallback UI or message
        }
    };

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Link copied to clipboard:', text);
                // Optionally show a success message or UI feedback
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
                // Handle error (e.g., show a message to the user)
            });
    };

    return (
        <div className=" bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Collaborative Decision Platform</h2>
                <div className="sm:flex sm:justify-between sm:space-x-4">
                    <div className="sm:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Add Options</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {options.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        ))}
                        {options.length < 5 && (
                            <button
                                onClick={handleAddOption}
                                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Add Option
                            </button>
                        )}
                    </div>
                    <div className="sm:w-1/2 mt-4 sm:mt-0">
                        <h2 className="text-xl font-semibold mb-4">Add Collaborators</h2>
                        {friends.map((friend, index) => (
                            <input
                                key={friend.id}
                                type="text"
                                value={friend.name}
                                onChange={(e) => handleFriendChange(index, e.target.value)}
                                placeholder={`Collaborator ${index + 1}`}
                                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        ))}
                        {friends.length < 5 && (
                            <button
                                onClick={handleAddFriend}
                                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Add Collaborator
                            </button>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleCreateRoom}
                    className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 focus:outline-none"
                >
                    Start Collaboration
                </button>
                {roomId && (
                    <div className="mt-4">
                        <h3 className="text-xl font-bold mb-2">Room ID: {roomId}</h3>
                        <h3 className="text-lg font-semibold mb-2">Share these links with your collaborators:</h3>
                        {links.map(({ friend, link }, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <p className="flex-grow">{friend.name}: <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{link}</a></p>
                                <button onClick={() => handleCopyToClipboard(link)} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 focus:outline-none mr-2">Copy</button>
                                {navigator.share && (
                                        <button onClick={() => handleShareLink(link)} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 focus:outline-none">Share</button>
                                    )}
                            </div>
                        ))}
                    </div>
                )}
                {allAnswered && handleResultDisplay()}
            </div>
        </div>
    );
};

export default CreateRoom;
