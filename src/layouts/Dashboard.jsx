import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();

    // Redirect user if not logged in
    useEffect(() => {
        if (isLoaded && !userId) {
            navigate('/sign-up');
        } else if (userId) {
            navigate('/dashboard');
        }
    }, [isLoaded, userId, navigate]);

    // Load & store interactions in localStorage
    const [interactions, setInteractions] = useState(() => {
        const savedInteractions = localStorage.getItem('interactions');
        return savedInteractions ? JSON.parse(savedInteractions) : [];
    });

    const lastInteractionRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('interactions', JSON.stringify(interactions));
    }, [interactions]);

    // Scroll to last message
    useEffect(() => {
        if (lastInteractionRef.current) {
            lastInteractionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [interactions]);

    // ⭐ REPLACED WITH OPENROUTER REQUEST
    const fetchData = async (text, interactionId) => {
        try {
            const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-3-pro-preview",
                    messages: [
                        { role: "user", content: text }
                    ]
                })
            });

            const data = await response.json();
            const answer = data?.choices?.[0]?.message?.content || "No response";

            // Update UI
            setInteractions(prev =>
                prev.map(interaction =>
                    interaction.id === interactionId
                        ? { ...interaction, answer }
                        : interaction
                )
            );
        } catch (err) {
            console.error('Error:', err);
        }
    };

    // Handle send message
    const handleSubmit = (e) => {
        e.preventDefault();
        const question = document.getElementById('Question').value;
        if (question) {
            const newInteraction = { id: Date.now(), question, answer: 'loading...' };
            setInteractions((prev) => [...prev, newInteraction]);
            document.getElementById('Question').value = '';
            fetchData(question, newInteraction.id);
        }
    };

    // Copy answer without Markdown
    const CopyContent = (text) => {
        const plainText = text.replace(/(\*\*|__|\*|_|\~\~|\`)/g, '');
        navigator.clipboard.writeText(plainText)
            .then(() => alert('Copied successfully'))
            .catch(err => console.error('Failed to copy:', err));
    };

    return (
        <div className='Dashboard'>
            <div className="DashboardMain">
                {interactions.length > 0 ? (
                    <div className='main'>
                        {interactions.map((interaction, index) => (
                            <div
                                key={interaction.id}
                                className={`interaction ${index % 2 === 0 ? 'right' : 'left'}`}
                                ref={index === interactions.length - 1 ? lastInteractionRef : null}
                            >
                                {/* Question */}
                                <div className='Question'>
                                    <ReactMarkdown>{interaction.question}</ReactMarkdown>
                                </div>

                                {/* Answer */}
                                <div className='Answer'>
                                    <ReactMarkdown>{interaction.answer}</ReactMarkdown>
                                    <button onClick={() => CopyContent(interaction.answer)}>Copy</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='empty' style={{ textAlign: 'center' }}>Nothing is there!</p>
                )}
            </div>

            {/* Input */}
            <div className='Div'>
                <input type="text" placeholder='Write Something...' id='Question' />
                <button onClick={handleSubmit} className='SendBtn'>Send</button>
            </div>
        </div>
    );
};

export default Dashboard;
