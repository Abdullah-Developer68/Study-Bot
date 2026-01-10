import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});

const sendUserPrompt = async (prompt) => {
  try {
    const res = api.post("chat", { prompt });
    return res;
  } catch (err) {
    console.error("Error sending prompt:", err);
    throw err; // re-throws the error so that the code that called this function can get it (similar to return)
  }
};

const exportData = { sendUserPrompt, api };

export default exportData;
