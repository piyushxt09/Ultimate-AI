import React from 'react'
import {SignIn } from "@clerk/clerk-react";
import './Signup.css';

const Login = () => {
    return (
        <div className='Sign-up'>
            <SignIn path='/login'/>
        </div>
    )
}

export default Login
