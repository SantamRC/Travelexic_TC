export const baseURL = 'https://tcgateway.travelexic.com/api/webservices/';

//export const baseURL = 'https://new.travelexic.com/api/webservices/';

//export const baseURL = 'https://tcil-sotc.travelexic.com/api/webservices/';

export const getallLocURL = baseURL + 'getallLoc';
export const putUserProfile = baseURL + 'putUserProfile';
export const bookinglistByUserIDURL = baseURL + 'bookinglistByUserID';
export const getollocalpinsURL = baseURL + 'getollocalpins';
export const getpinsURL = baseURL + 'getpins';
export const getlocalpinsbycityIDURL = baseURL + 'getlocalpinsbycityID';
export const getOtpURL = baseURL + 'getOtp'; //username, email
export const getUserDetailsURL = baseURL + 'getUserDetails';
export const getCurrentWeatherbylatlongURL =
  baseURL + 'getCurrentWeatherbylatlong';
export const reportProblemURL = baseURL + 'reportProblem';
export const getreviewandratingURL = baseURL + 'reviewandrating'; //?traveller_id=5854&rating=&reviewID=MEM-3-1624337190-420&reviewkey=radio&booking_id=31815&date=14-06-2021&reviewTitle=testing of radio button&reviewDesc=event 1&nonce=iOJpoqkEX4SOF2GP&question_id=3";
export const userFcmTokenUpdateURL = baseURL + 'update_fcm_token';
export const notificationHistoryURL = baseURL + 'notification_history';
export const getFlightstatsbyID = baseURL + 'getFlightstatsbyID';
export const getDriverCoordinates = baseURL + 'getDriverCoordinates';
export const change_itinerary = baseURL + 'change_itinerary';
export const forceApp = baseURL + 'forceApp';
export const document_fetch = baseURL + 'document_fetch';
export const upload_document = baseURL + 'upload_document';
export const getExhibitor = baseURL + 'getExhibitor';
export const interestExhibitor = baseURL + 'interestExhibitor';
export const getollocalpins_new = baseURL + 'getollocalpins_new';
export const fetch_feedback_questions = baseURL + 'fetch_feedback_questions'; //?booking_id=31816&auth=pXGxx0gAIrwAgBUX
export const save_poll_response = baseURL + 'save_poll_response'; //?poll_id=53&book_id=295&res=[{"option":"Item 1","ans":"false"},{"option":"Item 2","ans":"true"}]&nonce=KHsD(PF3JzQfT)nm3l^TERO
export const getAllCurrencyNames =
  'https://currency-converter5.p.rapidapi.com/currency/list?format=json';

export const getConvertCurrencyData =
  'https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=';

//thomas cook api forex
// export const getNewRequestToken =
//   'http://14.141.26.109/tcCommonRS/extnrt/getNewRequestToken';
export const getNewRequestToken =
  'https://services-uatastra.thomascook.in/tcCommonRS/extnrt/getNewRequestToken';

//thomas cook api forex
// export const getRoe = 'http://14.141.26.109/tcForexRS/generic/roe/1/1/0/2';
export const getRoe =
  'https://services-uatastra.thomascook.in/tcForexRS/generic/roe/1/1/0/2';

//key's
export const nonceForOTP = '2jaa^CKIB9rSStjPWgo!NZnP';
export const nonceForUserDetails = 'KHsD(PF3JzQfT)nm3l^TERO';
export const nonceForPreference = 'xS*HM)pZhnSWBi*qlfu1DTbN';
export const nonceFlightstats =
  '173648APz6zQ2jaa^CKIB9rSStjPWgo!NZnPYCKl59b2380d';
export const nonceDriver = 'KHsD(PF3JzQfT)nm3l^TERO';
export const nonceChangeItinerary = '^5Uxu)USdzeSzPN';
