import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import moment from "moment";
import ShiftByDay from "../ShiftByDay";

function AvailableShift({ shiftData }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const midNightTimeStamp = Number(moment().startOf("day").format("x")); //Timestamp of today's midnight.

  const sortedByArea = new Map();

  const result = shiftData.map((element) => {
    if (sortedByArea.has(element.area)) {
      sortedByArea.get(element.area).push(element);
    } else {
      sortedByArea.set(element.area, [element]);
    }
    return element;
  });

  // Print the result
  let areasArray = [];
  for (let [key, value] of sortedByArea) {
    areasArray.push(key);
  }

  const sortedData = sortedByArea.get(areasArray[selectedTab]);

  const groupedByDate = sortedData
    .filter((item) => item.startTime >= midNightTimeStamp)
    .reduce((acc, obj) => {
      const date = moment(obj.startTime).format("MMMM D");
      if (!acc[date]) acc[date] = [];
      acc[date].push(obj);
      return acc;
    }, {});

  return (
    <div>
      <Tabs
        value={selectedTab}
        onChange={(e, value) => {
          setSelectedTab(value);
        }}
        TabIndicatorProps={{
          style: {
            backgroundColor: "white",
          },
        }}
      >
        {areasArray.map((element) => (
          <Tab label={element} key={element} className="filterHeading" />
        ))}
      </Tabs>
      {groupedByDate &&
        Object.keys(groupedByDate).map((key) => {
          return (
            <ShiftByDay
              key={groupedByDate[key]}
              date={key}
              dayShiftData={groupedByDate[key]}
            />
          );
        })}
    </div>
  );
}

export default AvailableShift;
