import { Capacitor } from "@capacitor/core";

export const API_URL = Capacitor.getPlatform() === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
