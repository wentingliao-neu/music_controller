import React, { useState } from "react";
import {
   Button,
   Grid,
   Typography,
   TextField,
   FormControl,
   FormHelperText,
   Radio,
   RadioGroup,
   FormControlLabel,
   Collapse,
   Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function CreateRoomPage({
   update = false,
   votes = 2,
   pause = true,
   roomCode = null,
   updateCallback = () => {},
}) {
   const [votesToSkip, setVotesToSkip] = useState(votes);
   const [guestCanPause, setGuestCanPause] = useState(pause);
   const [message, setMessage] = useState("");

   const navigate = useNavigate();
   function handleRoomCreate() {
      const requestOptions = {
         method: "post",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            votes_to_skip: votesToSkip,
            guest_can_pause: guestCanPause,
         }),
      };
      fetch("/api/create-room", requestOptions)
         .then((response) => response.json())
         .then((data) => navigate(`/room/${data.code}`));
   }

   function handleRoomUpdate() {
      const requestOptions = {
         method: "patch",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            votes_to_skip: votesToSkip,
            guest_can_pause: guestCanPause,
            code: roomCode,
         }),
      };
      fetch("/api/update-room", requestOptions)
         .then((response) => {
            setMessage(
               response.ok ? "Update room successfully" : "Something went wrong"
            );
         })
         .then(() => updateCallback());
   }

   return (
      <Grid container spacing={1} alignItems="center">
         <Grid item xs={12}>
            <Collapse in={message != ""}>
               <Alert
                  onClose={() => {
                     setMessage("");
                  }}
                  severity={
                     message === "Update room successfully"
                        ? "success"
                        : "error"
                  }
               >
                  {message}
               </Alert>
            </Collapse>
         </Grid>
         <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
               {update ? "Update Room" : "Create a Room"}
            </Typography>
         </Grid>
         <Grid item xs={12} align="center">
            <FormControl component="fieldset">
               <FormHelperText>Guest Control of Playback State</FormHelperText>
               <RadioGroup
                  row
                  value={guestCanPause.toString()}
                  onChange={(e) => setGuestCanPause(e.target.value === "true")}
               >
                  <FormControlLabel
                     value="true"
                     control={<Radio color="primary" />}
                     label="Play/Pause"
                     labelPlacement="bottom"
                  />

                  <FormControlLabel
                     value="false"
                     control={<Radio color="secondary" />}
                     label="No Control"
                     labelPlacement="bottom"
                  />
               </RadioGroup>
            </FormControl>
         </Grid>
         <Grid item xs={12} align="center">
            <FormControl>
               <TextField
                  onChange={(e) => setVotesToSkip(e.target.value)}
                  required={true}
                  type="number"
                  defaultValue={votesToSkip}
                  inputProps={{ min: 1, style: { textAlign: "center" } }}
               />
               <FormHelperText>Votes Required To Skip Song</FormHelperText>
            </FormControl>
         </Grid>
         {!update ? (
            <>
               <Grid item xs={12} align="center">
                  <Button
                     color="primary"
                     variant="contained"
                     onClick={handleRoomCreate}
                  >
                     Create A Room
                  </Button>
               </Grid>
               <Grid item xs={12} align="center">
                  <Button
                     color="secondary"
                     variant="contained"
                     to="/"
                     component={Link}
                  >
                     Back
                  </Button>
               </Grid>
            </>
         ) : (
            <Grid item xs={12} align="center">
               <Button
                  color="primary"
                  variant="contained"
                  onClick={handleRoomUpdate}
               >
                  Update Room
               </Button>
            </Grid>
         )}
      </Grid>
   );
}
