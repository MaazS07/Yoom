"use client"
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({setIsSetupComplete}:{
  setIsSetupComplete:(value:boolean)=> void
}) => {

const [isMicToggledOn, setIsMicToggledOn] = useState(false)
const call=useCall();

if(!call)
{
  throw new Error("usecall must be used within StreamCall component") 
}
useEffect(()=>
{
if(isMicToggledOn)
{
  call?.camera.disable()
  call?.microphone.disable()
}
else{
  call?.camera.enable()
  call?.microphone.enable()
}
},[isMicToggledOn,call?.camera,call?.microphone])
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <VideoPreview/>
      <div className='flex h-16 justify-center items-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium '>
          <input
          className=''
          type="checkbox"
          checked={isMicToggledOn}
          onChange={(e)=> setIsMicToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings/>
      </div>
      <Button className='rounded-md bg-green-500 px-5 py-2.5'
      onClick={()=>
      {
        call.join();
        setIsSetupComplete(true)
      }
      }
      >
      Join Meeting
</Button>
    </div>
  )
}

export default MeetingSetup