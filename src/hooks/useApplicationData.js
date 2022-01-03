import { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day }); 

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);
 
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview})
    .then(() => {
      setState((prev) => {
        const spots = updateSpotsRemaining(prev, appointments);
        return { 
          ...prev,
          appointments,
          days: spots
        };
      }); 
    });   
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };  
   
    
    return axios.delete(`/api/appointments/${id}`, {interview})
    .then(() => {
      setState((prev) => {
        const spots = updateSpotsRemaining(prev, appointments);
        return { 
          ...prev,
          appointments,
          days: spots
        };
      });   
    });
  }

  function updateSpotsRemaining(state, appointments) {
    let spots = 0;

    const dayObj = state.days.find((day) => day.name === state.day);

    for (let id of dayObj.appointments) {
      if (appointments[id].interview === null) {
        spots++;
      }
    }

    const newDayObj = { ...dayObj, spots};
  
    const daysArray = state.days.map((day) => (day.name === state.day ? newDayObj : day));
    return daysArray;
  }
  return {state, setDay, bookInterview, cancelInterview}
}