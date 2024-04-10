import React from "react";
import {
   Grid,
   Typography,
   Card,
   IconButton,
   LinearProgress,
} from "@mui/material";
import { PlayArrow, SkipNext, Pause } from "@mui/icons-material";

export default function MusicPlayer({ song }) {
   const songProgress = (song.time / song.duration) * 100;

   function pauseSong() {
      const requestOptions = {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/pause", requestOptions);
   }
   function playSong() {
      const requestOptions = {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/play", requestOptions);
   }
   function skipSong() {
      console.log(1);
      const requestOptions = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/skip", requestOptions);
   }
   return (
      <Card>
         <Grid container alignItems="center">
            <Grid item align="center" xs={4}>
               <img src={song.image_url} height="100%" width="100%" />
            </Grid>
            <Grid item align="center" xs={8}>
               <Typography component="h5" variant="h5">
                  {song.title}
               </Typography>
               <Typography component="textSecondary" variant="subtitle1">
                  {song.artist}
               </Typography>
               <div>
                  <IconButton
                     onClick={() => {
                        song.is_playing ? pauseSong() : playSong();
                     }}
                  >
                     {song.is_playing ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <IconButton
                     onClick={() => {
                        console.log(0);
                        skipSong();
                     }}
                  >
                     {song.votes}/{song.votes_required}
                     <SkipNext />
                  </IconButton>
               </div>
            </Grid>
         </Grid>
         <LinearProgress variant="determinate" value={songProgress} />
      </Card>
   );
}
