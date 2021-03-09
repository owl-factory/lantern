import React from "react";
import { io, Socket } from "socket.io-client";


function loadUserMedia(success: (stream: MediaStream) => void ): void {
  function hasUserMedia() {
    return !!(
      navigator.getUserMedia || (navigator as any).webkitGetUserMedia || 
        (navigator as any).mozGetUserMedia
    );
  }

  if (hasUserMedia()) { 
    navigator.getUserMedia = (
      navigator.getUserMedia || (navigator as any).webkitGetUserMedia || 
    (navigator as any).mozGetUserMedia
    );

    //enabling video and audio channels
    navigator.getUserMedia(
      { video: true, audio: true },
      (stream) => success(stream),
      (err) => (console.log(err))
    );
  }
}



/**
 * Runs the game server and all of that
 */
export default function Play(): JSX.Element {
  const [ isLoaded, setIsLoaded ] = React.useState(false);
  const [ count, setCount ] = React.useState(0);
  const [ socket, setSocket ] = React.useState(null as null | Socket);
  const [ videos, setVideos ] = React.useState([] as JSX.Element[])

  function Video({stream}): JSX.Element {
    const refVideo = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
      if (!refVideo.current) return
      refVideo.current.srcObject = stream
    }, [stream])

    return <video style={{width: "300px", height:"300px"}} ref={refVideo} autoPlay/>
  }

  function addVideoStream( stream: MediaStream ) {
    const newVideo = <Video stream={stream}/>
    console.log("Add stream")
    console.log(videos)
    const newVideos = [ ...videos, newVideo ]
    setVideos(newVideos)
  }

  function connectToNewUser(userId, stream, myPeer) {
    const call = myPeer.call(userId, stream)
    call.on(`stream`, userVideoStream => {
      console.log("add stream")
      addVideoStream(userVideoStream);
    })
    call.on(`close`, () => {
      console.log("todo")
    })
  }

  React.useEffect(() => {
    async function func() {
      // Initial connection
      // initialize();
      // Load in data
      if (isLoaded === false) {
        const Peer = (await import("peerjs")).default;
        const myPeer = new Peer(undefined);
        const newSocket = io("http://192.168.0.195:3001");
        myPeer.on(`open`, (id) => {
          newSocket.emit("join-room", 123, id);
        })
        console.log(myPeer);

        

        newSocket.on("user-connected", (userId: any) => {
          console.log("Connected: ", userId);
        });

        const myVideo = document.createElement(`video`);
        myVideo.muted = true;

        navigator.mediaDevices.getUserMedia({ video: true }).then( (stream) => {
          myPeer.on(`call`, call => {
            call.answer(stream)
          })
          addVideoStream(stream);
          newSocket?.on(`user-connected`, userId => {
            connectToNewUser(userId, stream, myPeer)
          })
        }

        )

        setIsLoaded(true);
      }
      
    }
    func();

    console.log(count);

  });

  

  function inc() {
    setCount(count + 1);
  }

  function renderVideos() {
    const renderedVideo =  
    videos.forEach(video => {
      
    });
  }
  console.log(videos)
  return (
    <div>
      {isLoaded ? "We have loaded!" : "We are not loaded"}
      { count }
      <button onClick={inc}>Inc</button>
      { videos }
    </div>
  );
}
