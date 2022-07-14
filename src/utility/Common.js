import moment from 'moment';

// export function changeBottomNavigationColor() {
//   var bg_color = null;
//   // bg_color = await AsyncStorage.getItem(STORAGE_KEY_FOTTER_COLOR);

//   AsyncStorage.getItem(STORAGE_KEY_FOTTER_COLOR)
//     .then((value) => {
//       console.log("value: ", " / " + value);
//       bg_color = value;
//       return bg_color;
//     })
//     .then((res) => {
//       //do something else
//     });
//   if (bg_color != null) {
//     console.log("bg_color: ", " / " + bg_color);
//     return bg_color;
//   } else {
//     console.log("bg_color2: ", " / " + "#000000");
//     return "#000000";
//   }
// }

export function convertDateInFlightDate(value) {
  const newDate = moment(new Date(value * 1000)).format('DD/MM/yyyy');
  return newDate;
}

export function changeFlightData(value) {
  const newDate = moment(new Date(value))
    // .add(-5, 'hours')
    // .add(-30, 'minutes')
    .format('DD-MM-yyyy HH:mm');
  return newDate;
}

export function currentDate() {
  const newDate = moment(new Date()).format('DD/MM/yyyy HH:mm');
  return newDate;
}

export function currentDatePassport() {
  const newDate = moment(new Date()).format('DD/MM/yyyy');
  return newDate;
}

export function differenceBetweenTwoDates(tourDate) {
  var currentDate = moment(new Date()).format('yyyy-MM-DD');
  currentDate = new Date(currentDate);
  var tourDateInFormat = moment(new Date(tourDate * 1000)).format('yyyy-MM-DD');
  tourDateInFormat = new Date(tourDateInFormat);
  if (currentDate.getTime() < tourDateInFormat.getTime()) {
    var Difference_In_Time = tourDateInFormat.getTime() - currentDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  } else {
    return 0;
  }
}

export function convertDate(value) {
  const newDate = moment(new Date(value * 1000)).format('DD-MM-yyyy');
  return newDate;
}

export function convertDateInDayNameShort(value) {
  const newDate = moment(new Date(value * 1000)).format('ddd');
  return newDate;
}

export function convertDateInDayNamelong(value) {
  const newDate = moment(new Date(value * 1000)).format('dddd');
  return newDate;
}

export function convertDateInMonthDate(value) {
  const newDate = moment(new Date(value * 1000)).format('MMMM DD');
  return newDate;
}
export function convertDateInFlight(value) {
  const newDate = moment(value).format('ddd-DD MMM-YY HH:mm A');
  return newDate;
}
export function convertTimeInFlight(value) {
  const newDate = moment(value).format('HH:mm A');
  return newDate;
}

export function convertDateForTrips(value) {
  const newDate = moment(new Date(value * 1000)).format('DD MMMM YYYY');
  return newDate;
}

export function addMoreDays(value, days) {
  const newDate = moment(new Date(value * 1000))
    .add(days, 'd')
    .format('DD MMMM YYYY');
  return newDate;
}
