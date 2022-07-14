import http from "./HttpCommon";
import {
  forceApp,
  getUserDetailsURL,
  bookinglistByUserIDURL,
  interestExhibitor,
  getFlightstatsbyID,
  getDriverCoordinates,
  change_itinerary,
  getExhibitor,
  notificationHistoryURL,
  userFcmTokenUpdateURL,
  getreviewandratingURL,
  reportProblemURL,
  getCurrentWeatherbylatlongURL,
  getlocalpinsbycityIDURL,
  getpinsURL,
  getollocalpinsURL,
  putUserProfile,
  getallLocURL,
  getOtpURL,
  document_fetch,
} from "./ConstantURLS";

class AllTypesServices {
  // All Rest Services

  documentfetch(formDate) {
    return http.post(document_fetch, formDate, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  userLogin() {
    return http.post(getOtpURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  forceApp() {
    return http.get(forceApp);
  }

  userRegister() {
    let formDate = new FormData();
    formDate.append("username", "");
    formDate.append("email", "");
    formDate.append("nonce", "");
    formDate.append("device", "");

    return http.post(getUserDetailsURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  userBookingListData() {
    let formData = new FormData();

    formData.append("traveller_id", "");
    formData.append("Auth", "");

    return http.post(bookinglistByUserIDURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  interestExhibitor() {
    let formData = new FormData();

    formData.append("booking_id", "");
    formData.append("traveller_id", "");
    formData.append("interest_status", "");
    formData.append("exhibitor_id", "");
    formData.append("nonce", "");

    return http.post(interestExhibitor, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getExhibitor() {
    let formData = new FormData();

    formData.append("booking_id", "");
    formData.append("nonce", "");

    return http.post(getExhibitor, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  changeItinerary() {
    let formData = new FormData();

    formData.append("booking_id", "");
    formData.append("pickup_location", "");
    formData.append("traveller_id", "");
    formData.append("nonce", "");

    return http.post(change_itinerary, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getDriverCoordinates() {
    let formData = new FormData();

    formData.append("booking_id", "");
    formData.append("nonce", "");

    return http.post(getDriverCoordinates, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFlightstatsbyID() {
    return http.get(getFlightstatsbyID + data);
  }

  notificationHistoryURL() {
    let formData = new FormData();

    formData.append("booking_id", "");
    formData.append("user_id", "");

    return http.post(notificationHistoryURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  userFcmTokenUpdateURL() {
    let formData = new FormData();

    formData.append("auth", "");
    formData.append("user_id", "");
    formData.append("token_id", "");

    return http.post(userFcmTokenUpdateURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getreviewandratingURL() {
    let formData = new FormData();

    formData.append("date", "");
    formData.append("traveller_id", "");
    formData.append("booking_id", "");
    formData.append("nonce", "");
    formData.append("reviewTitle", "");
    formData.append("reviewDesc", "");
    formData.append("rating", "");
    formData.append("reviewID", "");
    formData.append("reviewkey", "");

    return http.post(getreviewandratingURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  reportProblemURL() {
    let formData = new FormData();

    formData.append("location_name", "");
    formData.append("location_id", "");
    formData.append("username", "");
    formData.append("user_email", "");
    formData.append("issue", "");
    formData.append("remark", "");

    return http.post(reportProblemURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getCurrentWeatherbylatlongURL() {
    let formData = new FormData();

    formData.append("lat", "");
    formData.append("lon", "");

    return http.post(getCurrentWeatherbylatlongURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getlocalpinsbycityIDURL() {
    let formData = new FormData();

    formData.append("city_id", "");

    return http.post(getlocalpinsbycityIDURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getpinsURL() {
    let formData = new FormData();

    formData.append("booking_id", "");

    return http.post(getpinsURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getollocalpinsURL() {
    let formData = new FormData();

    formData.append("booking_id", "");

    return http.post(getollocalpinsURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  putUserProfile() {
    let formData = new FormData();

    formData.append("traveller_id", "");
    formData.append("user_profile", "");
    formData.append("token_id", "");
    formData.append("nonce", "");

    return http.post(putUserProfile, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getallLocURL() {
    return http.get(getallLocURL);
  }
}

export default new AllTypesServices();
