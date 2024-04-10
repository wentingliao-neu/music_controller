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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function CreateRoomPage() {
   const [votesToSkip, setVotesToSkip] = useState(2);
   const [guestCanPause, setGuestCanPause] = useState(true);
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
   return (
      <Grid container spacing={1} alignItems="center">
         <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
               Create a Room
            </Typography>
         </Grid>
         <Grid item xs={12} align="center">
            <FormControl component="fieldset">
               <FormHelperText>Guest Control of Playback State</FormHelperText>
               <RadioGroup
                  row
                  value={guestCanPause ? "true" : "false"}
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
      </Grid>
   );
}
