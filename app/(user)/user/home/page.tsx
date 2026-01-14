import React from 'react'
import LibraryStats from './_components/Stats'
import Personalized from '../../_components/Personalized'

export default function HomePage() {
  return (
    <div className='admin-container'>

      
        {/* Stats Component */}
        <LibraryStats />

        <Personalized  userId={"6965100bfd6c6a706b205412"}/>
    </div>
  )
}
