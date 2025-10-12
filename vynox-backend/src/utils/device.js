// utils/device.js
import { UAParser } from "ua-parser-js";

export const getDeviceInfo = (req) => {
  const parser = new UAParser(req.headers["user-agent"] || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  return {
    deviceType: device.type || "Desktop",
    osName: os.name || "Unknown OS",
    browserName: browser.name || "Unknown Browser",
  };
};


export const getIp = (req) =>
  req.headers["x-forwarded-for"] || req.socket.remoteAddress;
