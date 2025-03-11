import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [language, setLanguage] = useState('javascript'); // Default language is JavaScript

    const handleErrors = useCallback((error) => {
        console.log('Socket error:', error);
        toast.error('Socket connection failed, please try again later.');
        reactNavigator('/');
    }, [reactNavigator]);

    useEffect(() => {
        const init = async () => {
            try {
                socketRef.current = await initSocket();
                socketRef.current.on('connect_error', handleErrors);
                socketRef.current.on('connect_failed', handleErrors);

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                });

                // Listening for joined event
                socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                    setIsLoading(false);
                });

                // Listening for disconnected
                socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => prev.filter((client) => client.socketId !== socketId));
                });
            } catch (error) {
                handleErrors(error);
            }
        };

        init();
        return () => {
            socketRef.current?.disconnect();
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
        };
    }, [roomId, location.state, handleErrors]);

    const copyRoomId = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (error) {
            toast.error('Could not copy the Room ID');
            console.error(error);
        }
    }, [roomId]);

    const leaveRoom = useCallback(() => {
        reactNavigator('/');
    }, [reactNavigator]);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div
            className="mainWrap"
            style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
            }}
        >
            <div
                className="aside"
                style={{
                    width: '250px',
                    padding: '10px',
                    backgroundColor: '#524d4d',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <div className="asideInner">
                    <h3>Connected</h3>
                    {isLoading ? (
                        <p>Loading clients...</p>
                    ) : (
                        <div className="clientsList">
                            {clients.map((client) => (
                                <Client key={client.socketId} username={client.username} />
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="languageSelect">Select Language:</label>
                    <select
                        id="languageSelect"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ margin: '10px 0', width: '100%' }}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c++">C++</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </div>
            <div
                className="editorWrap"
                style={{
                    flexGrow: 1,
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                    language={language} // Pass the selected language to the Editor component
                />
            </div>
        </div>
    );
};

export default EditorPage;
