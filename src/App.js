import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateRoom from './components/createRoom';
import JoinRoom from './components/joinRoom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreateRoom />} />
                <Route path="/join/:roomId/:userId" element={<JoinRoom />} />
            </Routes>
        </Router>
    );
};

export default App;
