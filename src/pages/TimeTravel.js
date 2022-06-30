import React from "react";
import { getTimeDifference, getDateTimeInUTC, getDayCount } from "../utils/constants";
import Home from "./Home";

const TimeTravel = () => {
  // eslint-disable-next-line no-unused-vars
  const [timeTravelDate, setTimeTravelDate] = React.useState(getDayCount(new Date()));
  // eslint-disable-next-line no-unused-vars
  const handleChangeFromDate = (event) => {
    const selectedDate = event.target.value;
    let diff = getTimeDifference(
      getDateTimeInUTC(new Date(selectedDate)),
      new Date("2022-05-22T18:30:00.000Z")
    );
    console.log(diff.days);
    setTimeTravelDate(diff.days);
  };

  return (
    <div className="text-white">
      <h1 className="text-primary col-12 text-center">You have been time travelled!</h1>
      <div className="col-6 form-group m-auto p-2">
        Date
        <input
          className="form-control"
          min="2022-05-23"
          max={new Date().toISOString().split("T")[0]}
          onChange={handleChangeFromDate}
          type="date"
        />
      </div>
      <Home timeTravelDate={timeTravelDate} showLoader={true} />
    </div>
  );
};

TimeTravel.propTypes = {};

export default TimeTravel;
