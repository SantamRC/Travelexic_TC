import http from "./HttpCommon";
import { upload_document, document_fetch } from "./ConstantURLS";

class UploadDocumentsService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("traveller_id", "");
    formData.append("booking_id", "");
    formData.append("nonce", "");
    formData.append("type", "");

    // flight
    formData.append("flight_arr", "");
    formData.append("flight_dep", "");
    formData.append("flight_name", "");
    formData.append("flight_date", "");

    //passport
    formData.append("name", "");
    formData.append("passno", "");
    formData.append("exp_date", "");
    formData.append("flight_dep", "");

    return http.post(upload_document, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getDocuments() {
    return http.get(document_fetch);
  }
}

export default new UploadDocumentsService();
