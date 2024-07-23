"use client";

import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from '@/components/ui/use-toast';
import { title } from 'process';
import { Textarea } from './textarea';
import ReactDatePicker from "react-datepicker"
import { Input } from './input';
const MeetingTypeList :React.FC= () => {
  const router = useRouter();

  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoinMeeting' | 'isInstantMeeting' | undefined>();

  const {user}=useUser();
  const client =useStreamVideoClient();
const[values,setValues]=useState(
  {
    dateTime: new Date(),
    description:"",
    link:""
  }
)

const [callDetails,setCallDetails]=useState<Call>()

const {toast}=useToast()
  const createMeeting= async()=>
    {
        if(!client || !user) return;

        try {
          if(!values.dateTime)
          {
            toast({
              title:"Please select a date and time"
            })
            return;
          }
          const id=crypto.randomUUID()
          const call=client.call("default",id)
          if(!call) throw new Error("Failed to create call") 
            const startsAt = values.dateTime ? values.dateTime.toISOString() : new Date(Date.now()).toISOString();

          const description=values.description || "Instant Meeting"

          await call.getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description: description
              }
            }
          });
setCallDetails(call)
if(!values.description)
{
  router.push(`/meeting/${call.id}`)
}
toast({
  title:"Meeting Created"
})

        } catch (error) {
          console.log(error)
          toast({
            title:"Failed t create Meeting"
          })
        }
    }
const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Join meeting via invitation"
        handleClick={() => setMeetingState("isJoinMeeting")}
        className="bg-yellow-1"
      />
{!callDetails?(
 <MeetingModal
 isOpen={meetingState === 'isScheduleMeeting'}
 onClose={()=> setMeetingState(undefined)}
 title="Create Meeting"
 className="text-center"
 buttonText="StartMeeting"
 handleClick={createMeeting}
 
 >
  <div className='flex flex-col gap-2.5 '>
    <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
    <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
    onChange={(e)=>
    {
      setValues({...values,description:e.target.value})
    }
    }
    />
  </div>
  <div
  className='flex w-full flex-col gap-2.5'>
    <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and Time</label>
    <ReactDatePicker
    selected={values.dateTime}
    onChange={(date)=>
    {
setValues({...values,dateTime:date!})
    }
    }
    showTimeSelect
    timeFormat='HH:mm'
    timeCaption='time'
    timeIntervals={15}
    dateFormat={"MMMM d, yyyy h:mm aa"}
    className='w-full rounded bg-dark-3 p-2 focus:outline-none'
    />

  </div>
 </MeetingModal>
):(<MeetingModal
  isOpen={meetingState === 'isScheduleMeeting'}
  onClose={()=> setMeetingState(undefined)}
  title="Create  meeting"
  className="text-center"
  handleClick={()=>
  {
    navigator.clipboard.writeText(meetingLink)

  toast({title:'Link Copied'})
  }}
  image="/icons/checked.svg"
  buttonIcon='/icons/copy.svg'
  buttonText="Copy Meeting Link"

  />)}
<MeetingModal
isOpen={meetingState === 'isInstantMeeting'}
onClose={()=> setMeetingState(undefined)}
title="Start an Instant Meeting"
className="text-center"
buttonText="StartMeeting"
handleClick={createMeeting}

/>

<MeetingModal
isOpen={meetingState === 'isJoinMeeting'}
onClose={()=> setMeetingState(undefined)}
title="Type the link"
className="text-center"
buttonText="Join Meeting"
handleClick={() => router.push(values.link || "/")}



>
  <Input
  placeholder='Meeting Link'
  className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
  onChange={(e)=>
  {
    setValues({...values,link:e.target.value})
  }
  }/>
</MeetingModal>

    </section>
  );
};

export default MeetingTypeList;
