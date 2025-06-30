# Collaborative Code Editor

A fully functional real-time collaborative code editor built to facilitate seamless multi-user programming sessions. This web-based platform supports simultaneous editing, room-based isolation, and multi-language syntax support. Developed using **React**, **Node.js**, and **Pusher**, it is designed for performance, scalability, and an intuitive user experience.

## Features

- **Real-Time Collaboration**: Implements instant code synchronization using **Pusher Channels**, ensuring all participants see live changes in real time.
- **Multiple Language Support**: Syntax highlighting and editing for **Python**, **C**, **C++**, and **Java**, with a modular design that allows for adding more languages.
- **Live User Presence**: Displays currently connected users within a session to improve visibility and team coordination.
- **Room-Based Editing**: Each collaboration session is uniquely identified by a Room ID, enabling isolated environments for different user groups.
- **Code Sync Infrastructure**: Robust sync mechanism ensures all clients maintain consistent state without data conflicts.
- **User Notifications**: Integrated toast notification system for events like user join/leave, errors, and room creation.
- **Extensible and Modular Architecture**: Built to support future enhancements such as authentication, in-browser compilation, and version control.

## Technology Stack

### Frontend
- React.js (with Hooks and Functional Components)
- React Router DOM
- React Toastify
- CSS (Flexbox and Grid for layout)

### Backend
- Node.js
- Express.js
- UUID (for Room ID generation)

### Real-Time Communication
- Pusher Channels (WebSocket abstraction for real-time events)

## Getting Started

Follow the instructions below to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Samyakjnz/collaborative-code-editor.git
cd collaborative-code-editor
# Backend setup
cd server
npm install

# Frontend setup
cd ../client
npm install
cd server
node index.js
cd ../client
npm start
