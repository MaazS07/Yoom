import CallList from '@/components/ui/CallList'
import React from 'react'

const Upcoming = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white '>
    <h1 className='text-3xl font-bold  '>
      <CallList type="upcoming"/>
    </h1>


</section>
  )
}

export default Upcoming