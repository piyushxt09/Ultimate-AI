import React from 'react'
import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className='Sign-up'>
      <SignUp path='/sign-up' />
    </div>
  )
}

export default Signup;
