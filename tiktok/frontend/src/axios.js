import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://dibu-tiktok-backend.herokuapp.com/",
});

export default axios;
