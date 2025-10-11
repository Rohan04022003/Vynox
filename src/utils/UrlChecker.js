import axios from "axios";

async function isURLReachable(url) {
  try {
    // agar http/https missing ho toh add.
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const response = await axios.get(url, { timeout: 5000 });
    return response.status >= 200 && response.status < 400;
  } catch (err) {
    return false; // agar request fail ho gayi toh invalid
  }
}

export default isURLReachable
