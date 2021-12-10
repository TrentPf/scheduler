import React from "react";

import "components/DayListItem.scss"

import classNames from "classnames";

export default function DayListItem(props) {

  function formatSpots(spots) {
    if (spots === 1) {
      return `${spots} spot `;
    } else if (spots === 0) {
      return `no spots `;
    } else {
      return `${spots} spots `;
    }
  }

  const dayClass = classNames("day-list__item", {"day-list__item--selected": props.selected}, {"day-list__item--full": !props.spots})
  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)} remaining</h3>
    </li>
  );
}
