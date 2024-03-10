import React, { useCallback, useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage.jsx";
import MusicPlayer from "./MusicPlayer.jsx";

export default function Room({ leaveRoomCallback }) {
   const [votesToSkip, setVotesToSkip] = useState(2);
   const [guestCanPause, setGuestCanPause] = useState(true);
   const [isHost, setIsHost] = useState(false);
   const [showSettings, setShowSettings] = useState(false);
   const [authenticated, setAuthenticated] = useState(false);
   const [song, setSong] = useState({});
   const { roomCode } = useParams();
   const navigate = useNavigate();

   const getRoomDetails = useCallback(() => {
      fetch(`/api/get-room?code=${roomCode}`)
         .then((response) => {
            if (!response.ok) {
               leaveRoomCallback();
               navigate("/");
            }
            return response.json();
         })
         .then((data) => {
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
            if (data.isHost) authenticateSpotify();
         });
   }, []);

   function authenticateSpotify() {
      fetch("/spotify/is-authenticated")
         .then((response) => response.json())
         .then((data) => {
            setAuthenticated(data.status);
            if (!data.status) {
               fetch("/spotify/get-auth-url")
                  .then((response) => response.json())
                  .then((data) => {
                     window.location.replace(data.url);
                  });
            }
         });
   }
   // useEffect(() => {
   //    authenticateSpotify();
   // }, [isHost]);
   useEffect(() => {
      function fetchCurrentSong() {
         fetch("/spotify/current-song")
            .then((response) => (response.ok ? response.json() : {}))
            .then((data) => setSong(data));
      }
      const intervalId = setInterval(fetchCurrentSong, 1000);

      return () => clearInterval(intervalId);
   }, []);
   useEffect(() => {
      getRoomDetails();
      // if (isHost) authenticateSpotify();
   }, []);
   async function handleLeave() {
      const requestOptions = {
         method: "post",
         headers: { "Content-Type": "application/json" },
      };
      fetch("/api/leave-room", requestOptions).then((_response) => {
         leaveRoomCallback();
         navigate("/");
      });
   }

   return showSettings ? (
      <Grid container spacing={1}>
         <Grid item xs={12} align="center">
            <CreateRoomPage
               update
               votes={votesToSkip}
               pause={guestCanPause}
               roomCode={roomCode}
               updateCallback={getRoomDetails}
            />
         </Grid>
         <Grid item xs={12} align="center">
            <Button
               color="secondary"
               variant="contained"
               onClick={() => setShowSettings(false)}
            >
               close
            </Button>
         </Grid>
      </Grid>
   ) : (
      <Grid container spacing={1}>
         <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
               Code :{roomCode}
            </Typography>
         </Grid>
         <MusicPlayer song={song} />
         {/* <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
               Votes: {votesToSkip}
            </Typography>
         </Grid>

         <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
               Guest Can Pause: {guestCanPause.toString()}
            </Typography>
         </Grid>
         <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
               Host: {isHost.toString()}
            </Typography>
         </Grid> */}
         {isHost && (
            <Grid item xs={12} align="center">
               <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowSettings(true)}
               >
                  Settings
               </Button>
            </Grid>
         )}
         <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" onClick={handleLeave}>
               Leave Room
            </Button>
         </Grid>
      </Grid>
   );
}
