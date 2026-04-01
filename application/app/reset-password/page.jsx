import React from 'react'
import { Suspense } from 'react';
import ResetPassword from '../components/templates/Reset'
const page = () => {
  return (
      <Suspense fallback={<p>Loading....</p>}>
<ResetPassword />
      </Suspense>
    
  )
}

export default page