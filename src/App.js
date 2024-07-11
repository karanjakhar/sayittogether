// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateRoom from './components/createRoom';
import JoinRoom from './components/joinRoom';
import Header from './components/header';
import Footer from './components/footer';

const App = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<CreateRoom />} />
                        <Route path="/join/:roomId/:userId" element={<JoinRoom />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
