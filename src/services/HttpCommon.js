import axios from "axios";
import { baseURL } from "./ConstantURLS";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
  },
});
