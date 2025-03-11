import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

// Import supported languages
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange, language }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        // Initialize the editor
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('codetog'),
                {
                    mode: language || 'javascript', // Default to JavaScript if no language is provided
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            // Listen for changes in the editor
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        // Update the mode when the language changes
        if (editorRef.current) {
            const modeMap = {
                javascript: 'javascript',
                python: 'python',
                java: 'text/x-java',
                'c++': 'text/x-c++src',
                html: 'htmlmixed',
                css: 'css',
                sql: 'text/x-sql',
            };

            const mode = modeMap[language] || 'javascript';
            editorRef.current.setOption('mode', mode);
        }
    }, [language]);

    useEffect(() => {
        // Listen for code changes from the socket
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return <textarea id="codetog"></textarea>;
};

export default Editor;
