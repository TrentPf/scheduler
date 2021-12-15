import React from "react";

import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";

import { useVisualMode } from "hooks/useVisualMode";
import Confirm from "./Confirm";

export default function Appointment(props) {
  
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CONFIRM = "CONFIRM";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (name && interviewer) {
      transition(SAVING);

      const interview = {
      student: name,
      interviewer
    };

      props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true))
    }
  }  

  function deleteInterview(student, interviewer) {  
    transition(DELETING, true);

    const interview = {
      student,
      interviewer
    };
    
    props.cancelInterview(props.id, interview)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true))

    transition(CONFIRM);  
  }

  return (
    <article className="appointment">
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={"Saving"}/>}
      {mode === DELETING && <Status message={"Deleting"}/>}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={transition(CONFIRM)}
          onEdit={transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back(EMPTY)} 
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back(SHOW)}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          onCancel={() => back()}
          message={"Are you sure you want to delete?"}
          onConfirm={deleteInterview}
        />
      )}
      {mode === ERROR_SAVE && <Error message={"Could not create appointment"}
        onClose={() => back()}
      />}
      {mode === ERROR_DELETE && <Error message={"Could not cancel appointment"}
        onClose={() => back()}
      />}
    </article>
  );
}