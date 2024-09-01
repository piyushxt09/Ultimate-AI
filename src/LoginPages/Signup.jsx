import React from 'react'
import { SignUp } from "@clerk/clerk-react";
import './Signup.css';

const Signup = () => {
  return (
    <div className='Sign-up'>
      <SignUp path='/sign-up' />
    </div>
  )
}

export default Signup;
