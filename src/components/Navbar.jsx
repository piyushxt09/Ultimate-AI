import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';

const Navbar = () => {
    const { userId, isLoaded } = useAuth();

    return (
        <div>
            <nav>
                <div className='logo-container'>
                    <Link to='/'><img src="Ultimate.png" alt="Ultimate.ai Logo" className="logo"/></Link>
                </div>
                <div className='buttons'>
                    {!userId ? (
                        <>
                            <Link to='/login' style={{ textDecoration: 'none', color: 'black' }}>
                                <button className='Login' style={{fontSize: '16px'}}>Log In</button>
                            </Link>
                            <Link to='/sign-up' style={{ textDecoration: 'none', color: 'black' }}>
                                <button className='Login' style={{fontSize: '16px'}}>Sign up</button>
                            </Link>
                        </>
                    ) : (
                        <header>
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton/>
                            </SignedIn>
                        </header>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
