import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { currentTimeAtom } from "../../store/currenttime";

const ButtonTime = ({data, playerRef, stopTime, index}) => {

  const [timeSecond, setTimeSecond] = useState(0);
  const [timeSecondStop, setTimeSecondStop] = useState(0);
  const[currentTime, setCurrentTime] = useAtom(currentTimeAtom)
  const patern = /([0-9][0-9]:[0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9]:[0-9][0-9])|([0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9])/;
  const [stateSection, setStateSection] = useState(localStorage.getItem(`statesection${index}`)? localStorage.getItem(`statesection${index}`) : 'notcompleted');
  
  useEffect(
    ()=>{
      const found = data.match(patern)
        if(found[0].split(':').length === 1){
            const seconds = found[0].split(':');
            const totalSeconds = seconds;
            setTimeSecond(totalSeconds);
        } else if(found[0].split(':').length === 2){
            const [minutes, seconds] = found[0].split(':');
            const totalSeconds = (+minutes) * 60 + (+seconds);
            setTimeSecond(totalSeconds);
        } else if(found[0].split(':').length === 3){
            const [hours, minutes, seconds] = found[0].split(':');
            const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
            setTimeSecond(totalSeconds);
        }     
      },[]
  )

  useEffect(
    ()=>{
      if(stopTime !== undefined){
        const foundStop = stopTime.match(patern);
        if(foundStop[0].split(':').length === 1){
            const seconds = foundStop[0].split(':');
            const totalSeconds = seconds;
            setTimeSecondStop(totalSeconds);
        } else if(foundStop[0].split(':').length === 2){
            const [minutes, seconds] = foundStop[0].split(':');
            const totalSeconds = (+minutes) * 60 + (+seconds);
            setTimeSecondStop(totalSeconds);
        } else if(foundStop[0].split(':').length === 3){
            const [hours, minutes, seconds] = foundStop[0].split(':');
            const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
            setTimeSecondStop(totalSeconds);
        }     
      } else {
        playerRef.current.internalPlayer.getDuration()
        .then((response) => {
          setTimeSecondStop(response)
        })
      }
    
    },[]
  )

  useEffect(
    () => {
      if (currentTime >= timeSecond){
          setInterval(() => {
          playerRef.current.internalPlayer.getCurrentTime()
          .then((response) => {
            setCurrentTime(response);
            localStorage.setItem('currentTime', response);
          })
          .then(() => console.log(currentTime)
          )
        },1000)
      }
      if(currentTime >= timeSecondStop){
        return clearInterval();
      }

    }, [currentTime === timeSecondStop])


    useEffect(
      () => {
        if (currentTime >= timeSecond && currentTime < timeSecondStop){
            document.getElementsByClassName("card")[index].classList.add("card-active");
        } else {
          document.getElementsByClassName("card")[index].classList.remove("card-active");
        }
      }, [currentTime])


      function progressBar(){
        if(currentTime > timeSecond && currentTime <= timeSecondStop && stateSection !== 'completed'){
          let timeNow = currentTime - timeSecond;
          let timeEnd = timeSecondStop - timeSecond;
          let result = (timeNow * 100) / timeEnd;
          localStorage.setItem(`timesection${index}`, result);   

          if (result >= 98){
            setStateSection('completed');
            localStorage.setItem(`statesection${index}`, 'completed');         
            return 100
          } else {
            return result;
          }
        } else if (stateSection === 'notcompleted'){
          return localStorage.getItem(`timesection${index}`) ? localStorage.getItem(`timesection${index}`) : 0;
        } else  if(stateSection === 'completed'){
          return 100
        } else  if (stateSection === 'inprogress'){
          return localStorage.getItem(`timesection${index}`);
        } 
      }

      const duration = () => {
        let time = timeSecondStop - timeSecond;
        if(time< 3600){
          return new Date(time * 1000).toISOString().substring(14, 19);
        }
        return new Date(time * 1000).toISOString().substr(11, 8);
      }
        
  return(
    <div className="card" onClick={() => playerRef.current.internalPlayer.seekTo(timeSecond)}>
      <p><strong>{data}</strong></p>
      <p className="duration">Durée : {duration()}</p>
      <progress className={"progressbar" + index} max="100" value={progressBar()}></progress>
    </div>
  )
}

export default ButtonTime;