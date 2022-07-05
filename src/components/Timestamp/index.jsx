import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import ButtonTime from '../ButtonTime';
import API_KEY_YOU_TUBE from '../../API.js';
import { currentTimeAtom, globalTimeAtom, notesAtom } from "../../store/currenttime";
import { useAtom, useAtomValue } from "jotai";
import Notes from "../Notes";

var getYouTubeID = require("get-youtube-id");


const Timestamp = () => {
 
    const [id, setId] = useState(localStorage.getItem('video')? localStorage.getItem('video') : '');
    const [description, setDescription] = useState("");
    const playerRef = useRef(null);
    const [notes, setNotes] = useAtom(notesAtom);
    const [globalTime, setGlobalTime] = useAtom(globalTimeAtom);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    useEffect(
      () => {
        if(isLoading == false){
            setInterval(() => {
            playerRef.current.internalPlayer.getCurrentTime()
            .then((response) => {
              setGlobalTime(response);
              localStorage.setItem('currentTime', response);
            })
          },1000)
        }  
      }, [isLoading])
    

    useEffect(
      ()=>{
        fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY_YOU_TUBE}`)
        .then((response) => response.json())
        .then((response) => {
        splitTimeStamp(response.items[0].snippet.description);
      })
      },[id]
    )

    function splitTimeStamp(description){
      let result = description.split('\n')
      const patern = /([0-9][0-9]:[0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9]:[0-9][0-9])|([0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9])/;
      const array = [];
      result.map(element => element.match(patern) != null ? array.push(element.match(patern).input) : null);
      setDescription(array);
    }

    function handleChange(e) {  
      localStorage.clear(); 
      localStorage.setItem('video',e.target.value);
      setId(getYouTubeID(e.target.value));
      window.location.reload();
    }
    
    const opts = {
      playerVars: {
        autoplay: 1
      }
    };

    function currentTimeVideo(e){
      if(localStorage.getItem('video')){
        setId(getYouTubeID(localStorage.getItem('video')));
      }
        localStorage.getItem('currentTime')? e.target.seekTo(Number(localStorage.getItem('currentTime'))) : e.target.seekTo(0)
        setIsLoading(false)
    }

    const seektotime = (e) => {
      playerRef.current.internalPlayer.seekTo(Number(globalTime) + Number(e.target.attributes[0].value));
    }

    const addNote = () => {
      playerRef.current.internalPlayer.getCurrentTime()
      .then((response) => {
        const note = {
          id : response,
          content : "Edit Content",
          timestamp : response
        };
      setNotes([...notes, note]);     
      
      //window.addEventListener('click', (e)=> {
      //  if(e.target.id === `remove${response}`){
      //    document.getElementById(`flexnote${response}`).remove();
      //    setNotes(notes.filter((element) => element.id !== note.id));
      //  }
      //  if(e.target.id === `seek${response}`){
      //    playerRef.current.internalPlayer.seekTo(response);
      //  }
      //})
      })
    }

   

    return (
      <>
        
        <div className="searchsection">
          <input
            type="text"
            onChange={handleChange}
            required
            placeholder="YouTube URL..."
          />
        </div>
        <div className="mainwrapper">
          <div className="videocontent">
            <YouTube 
            videoId={id} 
            opts={opts} 
            onReady={currentTimeVideo}
            ref={playerRef}
            className="videoyoutube"
            />
            <div>
              <button onClick={seektotime} data-attributes={-30}>retour 30s</button>
              <button onClick={seektotime} data-attributes={-10}>retour 10s</button>
              <button onClick={seektotime} data-attributes={10}>avance 10s</button>
              <button onClick={seektotime} data-attributes={30}>avance 30s</button>
            </div>
            <button onClick={addNote}>Add Note</button>
             { notes.length > 0?             
              notes.map((note,index) => <Notes note={note} playerRef={playerRef} key={index}/>) 
            : 
              null}
            </div>         
  

          <div className="wrapcard">

            {description === "" ? null :
            Object.keys(description).map((element, index) => {
            const data = description[element];
            const stopTime = description[Number(element) + 1];
            return(<ButtonTime index={index} stopTime={stopTime} playerRef={playerRef} data={data} key={element}/>)
          })}
          </div>
        </div>
         
      </>
    );
}
export default Timestamp;