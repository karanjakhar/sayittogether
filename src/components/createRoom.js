// CreateRoom.js
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const CreateRoom = () => {
    const [options, setOptions] = useState(['']);
    const [friends, setFriends] = useState(['']);
    const [roomId, setRoomId] = useState('');
    const [links, setLinks] = useState([]);

    const handleAddOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddFriend = () => {
        setFriends([...friends, '']);
    };

    const handleFriendChange = (index, value) => {
        const newFriends = [...friends];
        newFriends[index] = value;
        setFriends(newFriends);
    };

    const handleCreateRoom = async () => {
        const id = uuidv4();
        setRoomId(id);
        const roomData = {
            roomId: id,
            options: options.filter(option => option.trim() !== ''),
            selections: {},
            friends: friends.filter(friend => friend.trim() !== '')
        };
        await setDoc(doc(db, 'rooms', id), roomData);
        const friendLinks = roomData.friends.map(friend => ({
            friend,
            link: `${window.location.origin}/join/${id}/${uuidv4()}`
        }));
        setLinks(friendLinks);
    };

    return (
        <div>
            <h2>Create Room</h2>
            {options.map((option, index) => (
                <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                />
            ))}
            {options.length < 5 && <button onClick={handleAddOption}>Add Option</button>}
            <h2>Add Friends</h2>
            {friends.map((friend, index) => (
                <input
                    key={index}
                    type="text"
                    value={friend}
                    onChange={(e) => handleFriendChange(index, e.target.value)}
                    placeholder={`Friend ${index + 1}`}
                />
            ))}
            <button onClick={handleAddFriend}>Add Friend</button>
            <button onClick={handleCreateRoom}>Create Room</button>
            {roomId && (
                <div>
                    <h3>Room ID: {roomId}</h3>
                    <h3>Share these links with your friends:</h3>
                    {links.map(({ friend, link }, index) => (
                        <div key={index}>
                            <p>{friend}: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CreateRoom;
