import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });

  const setDay = day => setState({ ...state, day }); 

  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };
  
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };  

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
    setState({
      ...state,
      appointments
    }); 
    return axios.put(`/api/appointments/${id}`, {interview})
  }

  function cancelInterview(id, interview) {
    setState({
      ...state,
      appointments
    });
    return axios.delete(`/api/appointments/${id}`, interview)
  }

  function updateSpotsRemaining(state, id) {

    const listOfAppointmentsIds = day.appointments
    const listOfEmptyAppointments = listOfAppointmentsIds.filter(appId => !appointments[appId].interview)
    const spots = listOfEmptyAppointments.length;

    setState({
      ...state,
      spots
    });
  }
  return {state, setDay, bookInterview, cancelInterview}
}