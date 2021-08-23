const dayjs = require('dayjs');

let objectiveStartDate = "2021-07-01T00:00:00.000Z"
let objectiveEndDate = "2021-09-30T00:00:00.000Z"
let today = dayjs().format()

function objectiveDays(day1, day2) {
    //* Found out how many days are between two dates
    let startTime = dayjs(day1)
    let endTime = dayjs(day2)
    let hours = endTime.diff(startTime, 'hours');
    const days = Math.floor(hours / 24);
    return days

}

function daysLeft(todaysDate, objectiveEndDate) {
    let startTime = dayjs(todaysDate)
    let endTime = dayjs(objectiveEndDate)
    let hours = endTime.diff(startTime, 'hours');
    const days = Math.floor(hours / 24);
    return days
}

const percentTimeLeft = Math.round(daysLeft(today, objectiveEndDate) / objectiveDays(objectiveStartDate,objectiveEndDate) * 100) / 100



