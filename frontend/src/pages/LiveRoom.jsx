import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StreamVideo, StreamVideoClient, StreamCall, SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { FaSignOutAlt } from "react-icons/fa";

export default function LiveRoom() {
  const { userData } = useSelector((state) => state.user);
  const { meetingId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    const initCall = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/live/get-token`, { withCredentials: true });
        
        const user = {
          id: userData._id,
          name: userData.name,
          image: userData.photoUrl,
        };

        const myClient = new StreamVideoClient({ apiKey: data.apiKey, user, token: data.token });
        const myCall = myClient.call('default', meetingId);

        await myCall.join({ create: true });

        setClient(myClient);
        setCall(myCall);
      } catch (error) {
        console.error(error);
        toast.error("Failed to join live class");
        navigate(-1);
      }
    };

    initCall();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [meetingId, userData]);

  // === NEW: HANDLE END CLASS ===
  const handleEndClass = async () => {
    const confirmEnd = window.confirm("Are you sure you want to end this class for everyone?");
    if (!confirmEnd) return;

    try {
      // 1. Tell Backend to mark class as finished
      await axios.post(`${serverUrl}/api/live/end`, { meetingId }, { withCredentials: true });
      
      // 2. End Call locally
      if (call) await call.endCall();
      
      toast.success("Class Ended");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Error ending class");
    }
  };
  // =============================

  if (!client || !call) return <div className="h-screen flex items-center justify-center text-white bg-slate-900">Loading Class...</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden">
          
          {/* HEADER BAR */}
          <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
             <span className="text-white font-bold text-lg">🔴 Live Lecture</span>
             
             {/* TEACHER BUTTON: END CLASS */}
             {userData.role === 'educator' ? (
                <button 
                  onClick={handleEndClass}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                >
                   End Class <FaSignOutAlt />
                </button>
             ) : (
                /* STUDENT BUTTON: LEAVE */
                <button 
                  onClick={() => navigate('/allcourses')}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                >
                   Leave Class
                </button>
             )}
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* LEFT: WHITEBOARD */}
            <div className="flex-1 relative border-r border-slate-700">
              <Tldraw 
                hideUi={userData.role === 'student'} 
                readOnly={userData.role === 'student'}
              />
               {userData.role === 'student' && (
                  <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-xs z-50 pointer-events-none">
                      View Only Mode
                  </div>
               )}
            </div>

            {/* RIGHT: VIDEO */}
            <div className="w-[350px] flex flex-col bg-slate-800">
              <div className="flex-1 overflow-y-auto p-2">
                <SpeakerLayout participantsBarPosition="bottom" />
              </div>
              
              <div className="p-4 bg-slate-900 border-t border-slate-700">
                {/* Standard Call Controls (Mute/Video/Etc) */}
                <CallControls onLeave={() => navigate(-1)} />
              </div>
            </div>
          </div>

        </div>
      </StreamCall>
    </StreamVideo>
  );
}