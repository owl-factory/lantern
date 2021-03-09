import React from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";

function RenderUsers({users}: {users: Record<string, unknown>}): JSX.Element {
  const list = Object.keys(users);
  
  return (
    <>
      { list }
    </>
  );
}

export function Play(): JSX.Element {
  const tableID = "1234";
  const [ myID, setMyID ] = React.useState("-1");
  const [ users, setUsers ] = React.useState<Record<string, unknown>>({});

  function addUser(id: string, stream?: MediaStream) {
    const newUsers = { ...users };
    console.log({ ...users })
    console.log(newUsers)
    newUsers[id] = stream;
    setUsers(newUsers);
  }

  React.useEffect(() => {
    // Opens socket for us to connect to the table
    const socket = io("192.168.0.195:3001");
    const peer = new Peer(undefined);

    // Fires when we connect to the Peer (signal) server
    peer.on(`open`, (id: string) => {
      console.log("Peer Open");
      socket.emit(`join-table`, tableID, id);
      setMyID(id);
      addUser(id);
    });

    socket.on(`user-connected`, (id: string) => {
      console.log("New user", id)
      addUser(id);
    });

  }, []);

  return <p><RenderUsers users={users}/></p>;
}
export default Play;

// function loadUserMedia(success: (stream: MediaStream) => void ): void {
//   function hasUserMedia() {
//     return !!(
//       navigator.getUserMedia || (navigator as any).webkitGetUserMedia || 
//         (navigator as any).mozGetUserMedia
//     );
//   }

//   if (hasUserMedia()) { 
//     navigator.getUserMedia = (
//       navigator.getUserMedia || (navigator as any).webkitGetUserMedia || 
//     (navigator as any).mozGetUserMedia
//     );

//     //enabling video and audio channels
//     navigator.getUserMedia(
//       { video: true, audio: true },
//       (stream) => success(stream),
//       (err) => (console.log(err))
//     );
//   }
// }



// /**
//  * Runs the game server and all of that
//  */
// export function Play(): JSX.Element {
//   const [ myUserID, setUserID ] = React.useState("");
//   const [ isLoaded, setIsLoaded ] = React.useState(false);
//   const [ count, setCount ] = React.useState(0);
//   const [ users, setUsers ] = React.useState<Record<string, unknown>>({});

//   const tableID = "1234";
  
//   function newUser(id: string, stream?: MediaStream) {
//     const newUsers = { ...users };
//     newUsers[id] = stream;
//     setUsers(newUsers);
//   }



//   React.useEffect(() => {
//     // Opens a socket
//     const socket = io("http://192.168.0.195:3001");
//     const peer = new Peer(undefined); // Connect to default peerjs


//     socket.on(`user-connected`, (userID: string) => {
//       console.log("User connected", userID);
//       newUser(userID);
//     });

//     // Actions to take when a user disconnects
//     socket.on(`user-disconnected`, (userID: string) => {
//       console.log(`user-disconnected: ${userID}`);
//     });

//     async function test() { 
//       // Loads in the Peer, as this must be client-side only
//       // const Peer = (await import("peerjs")).default;

//       // Joins the Table when the peer connection is open
//       peer.on(`open`, (id: string) => {
//         console.log("Peer open")
//         socket.emit(`join-table`, tableID, id);
//         newUser(id);
//       });

//       // Start by running in the navigator since we need the stream for these actions
//       // navigator.mediaDevices.getUserMedia({ video: true }).then( (stream: MediaStream) => {
//       //   addVideoStream(stream);

//       //   // Actions to run when the client is called by another user
//       //   peer.on(`call`, call => {
//       //     call.answer(stream);
//       //   });

//       //   // Actions to run when a new user connects to the room
        
//       // })
//       // .catch( (err) => {
//       //   console.log(err)
//       // });

      
//     }
//     test();
//   }, []);

  

//   function inc() {
//     setCount(count + 1);
//   }

//   function listUsers() {
//     let userList = ``;
//     const keys = Object.keys(users);
//     keys.forEach((key: string) => {
//       if (userList !== ``) { userList += `, `; }
//       userList += key;
//     });

//     return userList;
//   }

//   return (
//     <div>
//       {isLoaded ? "We have loaded!" : "We are not loaded"}
//       { count }
//       <button onClick={inc}>Inc</button>
//       <br/>
//       <div>My user id: {myUserID}</div><br/>
//       <div>Active Users: {listUsers()}</div>
//     </div>
//   );
// }
