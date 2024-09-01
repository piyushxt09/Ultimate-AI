import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './Home.css';

const Home = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only redirect if the user is trying to access a protected route
        if (isLoaded) {
            if (userId) {
                navigate('/dashboard');
            }
        }
    }, [userId, isLoaded, navigate]);

    return (<>
        <div className='home-page'>
            <div>
                <h1>Ultimate AI</h1>
                <h3>Supercharge your creativity and productivity</h3>
                <p>Experience seamless conversation with our AI chat app. Connect <br /> effortlessly, get instant responses.</p>
                <Link to='/sign-up' style={{textDecoration: 'none'}}>
                    <button>Get Started</button>
                </Link>
            </div>
            <div>
                <img src="coder.png" alt="Coder" />
            </div>
        </div>
        <div className="footer">
        <p>&copy; 2024 piyush_xt09__ <br /> All rights reserved.</p>
        </div>
    </>
    );
};

export default Home;
