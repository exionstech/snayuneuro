import React from 'react'
import BookingForm from './_components/booking-form'

const HomePage = () => {
  return (
    <div className='w-full min-h-screen flex max-w-screen-2xl mx-auto px-5 md:px-14 pt-20 flex-col gap-6'>
      <div className="text-center">
        <h1 className='text-4xl font-bold'>Book an Appointment</h1>
      </div>
      <BookingForm/>
    </div>
  )
}

export default HomePage
