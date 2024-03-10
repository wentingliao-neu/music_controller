import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage.jsx";
import CreateRoomPage from "./CreateRoomPage.jsx";

import {
   BrowserRouter as Router,
   Routes,
   Route,
   Link,
   Redirect,
   Navigate,
} from "react-router-dom";
import Room from "./Room.jsx";
import { Grid, Typography, ButtonGroup, Button } from "@mui/material";
export default function HomePage() {
   const [roomCode, setRoomCode] = useState(null);
   useEffect(() => {
      async function getCode() {
         fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
               setRoomCode(data.code);
            });
      }
      getCode();
   }, []);

   function RenderHomePage() {
      return (
         <Grid container spacing={3}>
            <Grid item xs={12} align="center">
               <Typography variant="h3" compact="h3">
                  House Party
               </Typography>
            </Grid>
            <Grid item xs={12} align="center">
               <ButtonGroup
                  disableElevation
                  variant="contained"
                  color="primary"
               >
                  <Button color="primary" to="/join" component={Link}>
                     Join a Room
                  </Button>
                  <Button color="secondary" to="/create" component={Link}>
                     Create a Room
                  </Button>
               </ButtonGroup>
            </Grid>
         </Grid>
      );
   }

   return (
      <Routes>
         <Route
            exact
            path="/"
            element={
               roomCode ? (
                  <Navigate to={`/room/${roomCode}`} />
               ) : (
                  <RenderHomePage />
               )
            }
         ></Route>
         <Route path="/join" element={<RoomJoinPage />}></Route>
         <Route path="/create" element={<CreateRoomPage />}></Route>
         <Route
            path="/room/:roomCode"
            element={<Room leaveRoomCallback={() => setRoomCode(null)} />}
         ></Route>
      </Routes>
   );
}
