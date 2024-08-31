import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate('/sign-up');
        } else if (userId) {
            navigate('/dashboard');
        }
    }, [isLoaded, userId, navigate]);

    // useState hook for interactions
    const [interactions, setInteractions] = useState(() => {
        const savedInteractions = localStorage.getItem('interactions');
        return savedInteractions ? JSON.parse(savedInteractions) : [];
    });

    // Save interactions to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('interactions', JSON.stringify(interactions));
    }, [interactions]);

    // Safety settings for the API
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ];

    // Function to fetch data from the GoogleGenerativeAI API
    const fetchData = async (text, interactionId) => {
        try {
            const API_KEY = import.meta.env.VITE_GEMINI_PUBLIC_KEY;
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
            const result = await model.generateContent(text);
            const answer = result.response.text();

            // Update the interaction with the answer
            setInteractions((prev) => 
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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const question = document.getElementById('Question').value;
        if (question) {
            const newInteraction = { id: Date.now(), question, answer: 'loading...' };
            setInteractions((prev) => [...prev, newInteraction]);

            // Clear the input field after submission
            document.getElementById('Question').value = '';

            // Fetch answer from the API
            fetchData(question, newInteraction.id);
        }
    };

    // Copy content to clipboard
    const CopyContent = (text) => {
        const plainText = text.replace(/(\*\*|__|\*|_|\~\~|\`)/g, ''); // Removing markdown symbols
        navigator.clipboard.writeText(plainText)
            .then(() => {
                alert('Copied successfull');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className='Dashboard'>
            <div className="DashboardMain">
                {interactions && interactions.length > 0 ? (
                    <div className='main'>
                        {interactions.map((interaction, index) => (
                            <div key={interaction.id} className={`interaction ${index % 2 === 0 ? 'right' : 'left'}`}>
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
            <div className='Div'>
                <input type="text" placeholder='Write Something...' id='Question' />
                <button onClick={handleSubmit} className='SendBtn'>Send</button>
            </div>
        </div>
    );
};

export default Dashboard;
