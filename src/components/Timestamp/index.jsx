import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import ButtonTime from '../ButtonTime';
import API_KEY_YOU_TUBE from '../../API.js';

var getYouTubeID = require("get-youtube-id");


const Timestamp = () => {
 
    const [id, setId] = useState(localStorage.getItem('video')? localStorage.getItem('video') : '');
    const [description, setDescription] = useState("");
    const playerRef = useRef(null);
    const [notes, setNotes] = useState(localStorage.notes ? JSON.parse(localStorage.notes) : []
    );

    useEffect(() => {
      localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);
    

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
    }

    const seektotime = (e) => {
      playerRef.current.internalPlayer.seekTo(Number(localStorage.getItem('currentTime')) + Number(e.target.attributes[0].value));
    }

    const duration = (e) => {
      if(e< 3600){
        return new Date(e * 1000).toISOString().substring(14, 19);
      }
      return new Date(e * 1000).toISOString().substr(11, 8);
    }

    const addNote = () => {
      playerRef.current.internalPlayer.getCurrentTime()
      .then((response) => {
        const note = {
          id : response,
          content : `<div class="flexnote" id="flexnote${response}">
        <div><p class="seek"><u id="seek${response}">${duration(response)}</u></p></div>
        <div contenteditable="true"><p>Edit me</p></div>
        <span id="remove${response}" class="seek material-symbols-outlined">delete</span>
      </div>`
        };
      setNotes([...notes, note]);
        document.getElementById("listnote").insertAdjacentHTML('afterbegin', note.content)

      
      
      window.addEventListener('click', (e)=> {
        if(e.target.id === `remove${response}`){
          document.getElementById(`flexnote${response}`).remove();
          setNotes(notes.filter((element) => element.id !== note.id));
        }
        if(e.target.id === `seek${response}`){
          playerRef.current.internalPlayer.seekTo(response);
        }
      })
      })
    }

    useEffect(
      ()=>{
        if(notes.length >= 1){
          notes.map(element => {
            document.getElementById("listnote").insertAdjacentHTML('afterbegin', element.content);
            
            window.addEventListener('click', (e)=> {
              if(e.target.id === `remove${element.id}`){
                document.getElementById(`flexnote${element.id}`).remove();
                setNotes(notes.filter((note) => note.id !== element.id));
              }
              if(e.target.id === `seek${element.id}`){
                playerRef.current.internalPlayer.seekTo(element.id);
              }
            })
          })
        }
        
      },[]
    )
   

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
            />
            <div>
              <button onClick={seektotime} data-attributes={-30}>retour 30s</button>
              <button onClick={seektotime} data-attributes={-10}>retour 10s</button>
              <button onClick={seektotime} data-attributes={10}>avance 10s</button>
              <button onClick={seektotime} data-attributes={30}>avance 30s</button>
            </div>
            <button onClick={addNote}>Add Note</button>
            <div id="listnote">
            </div>         
  

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