import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { notesAtom } from "../../store/currenttime";

const Notes = ({note, playerRef}) => {

  const [notes, setNotes] = useAtom(notesAtom);

  const autosavecontentnote = async (e) => {
    const promises = notes.map(element => {
      if(element.id == note.id){
        element.content = e.target.textContent
      }
    })
    await Promise.all(promises)
    .then(localStorage.setItem("notes", JSON.stringify(notes)))
    .then(setNotes(notes))
  }


  const gototimestamp = () => {
    playerRef.current.internalPlayer.seekTo(note.timestamp);
  }

  const deletenote = (e) => {
    e.preventDefault();
    setNotes(notes.filter((element) => element.id !== note.id));
  }

  const duration = (e) => {
    if(e< 3600){
      return new Date(e * 1000).toISOString().substring(14, 19);
    }
    return new Date(e * 1000).toISOString().substr(11, 8);
  }


  return(
    <>
       <div className="flexnote" id={"flexnote" + note.id}>
        <p className="seek"><u id={"seek" + note.id} onClick={gototimestamp}>{duration(note.timestamp)}</u></p>
        <p contentEditable="true" suppressContentEditableWarning={true} onInput={autosavecontentnote}>{note.content}</p>
        <span id="remove${response}" className="seek material-symbols-outlined" onClick={deletenote}>delete</span>
      </div> 
    </>
  )
}

export default Notes;