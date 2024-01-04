import * as d3 from 'd3'
import {useEffect, useRef} from "react";

export type sleepingDataType = {
  date: string,
  sleepTime: string, // Suppose this is ISO 8601 calendar date extended format: YYYY-MM-DDTHH:mm:ss.sssZ
  awakeTime: string,
}

const maxTimeDelta = (data: sleepingDataType[]) => {
  const sleepingData = data
    .map(sleepingData => {
      const date = new Date(sleepingData.date)
      const sleepTime = new Date(sleepingData.sleepTime)
      const awakeTime = new Date(sleepingData.awakeTime)
      const sleepingHourIn48 = d3.timeDay.count(date, sleepTime) * 24 + sleepTime.getHours() - 24
      return {sleepTime, awakeTime, sleepingHourIn48}
    })
    .reduce((pre, cur) => {
      return {
        sleepTime: cur.sleepingHourIn48 < pre.sleepingHourIn48 ? cur.sleepTime : pre.sleepTime, // How to deal with sleep time?
        awakeTime: cur.awakeTime.getHours() > pre.awakeTime.getHours() ? cur.awakeTime : pre.awakeTime,
        sleepingHourIn48: cur.sleepingHourIn48,
      }
    })
  const asleepTimeMin = sleepingData.sleepTime.getHours() - 1
  let awakeTimeMax = sleepingData.awakeTime.getHours() + 1
  if (awakeTimeMax < asleepTimeMin) awakeTimeMax += 24
  let sleepHours: number[] = []
  for (let hour = asleepTimeMin; hour < awakeTimeMax; hour++) {
    let actualHour = hour % 24
    sleepHours.push(actualHour)
  }
  return sleepHours
}

export default function SleepingDataBoxPlot({data}: { data: sleepingDataType[] }) {
  // Calculate the chart’s dimensions.
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 40;
  const marginBottom = 30;
  const marginLeft = 40;
  // The data input does always in a week.
  const x = d3.scaleTime(
    [new Date(data[0].date), new Date(data[data.length - 1].date)],
    [marginLeft, width - marginRight])
  const xTicks = x.ticks().map

  const series = d3.groups(data, sleepingData => {
    return new Date(sleepingData.date)
  })

  const y = d3.scaleLinear(
    maxTimeDelta(data),
    [marginTop, height - marginBottom]
  )
  return (
    <svg width={width} height={height}>

    </svg>
  )
}
