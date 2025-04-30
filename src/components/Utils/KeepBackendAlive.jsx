import { useEffect } from "react";
import axios from "axios";

const baseURL = "https://quramdetector-k92n.onrender.com";

const KeepBackendAlive = () => {
    useEffect(() => {
        const pingServer = async () => {
            try {
                console.log("🔄 Keeping backend awake...");
                await axios.get(`${baseURL}/deploy/`);
                console.log("✅ Backend is awake!");
            } catch (error) {
                console.error("⚠️ Failed to ping backend:", error);
            }
        };

        pingServer();
        const interval = setInterval(pingServer, 180000);

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default KeepBackendAlive;
