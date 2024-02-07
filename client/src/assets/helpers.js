import axios from "axios";

export async function getVehicleDetails(vehicleNumber) {
    const url = SERVER_URL + "api/vehicles/" + vehicleNumber;
    try {
        const vehicleRes = await axios.get(url);
        const vehicleData = vehicleRes.data;
        return vehicleData;
    } catch (err) {
        console.log(err);
        return;
    }
}

export async function getUser(userId) {
    try {
        const userDetails = await axios.get(SERVER_URL + "api/users/" + userId);

        return userDetails.data;
    } catch (err) {
        console.log(userId);
        console.log(err);
        return;
    }
}

export function getDateTimeFormat() {
    return new Intl.DateTimeFormat("en-us", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export function downloadJSONFile(fileName, jsonString) {
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const tempA = document.createElement("a");
    tempA.href = downloadUrl;
    tempA.download = fileName;

    document.body.appendChild(tempA);
    tempA.click();

    document.body.removeChild(tempA);
    window.URL.revokeObjectURL(downloadUrl);
}

export function readJSONFromFile() {
    return new Promise((resolve, reject) => {
        const tempInput = document.createElement("input");
        tempInput.type = "file";
        tempInput.accept = ".json"; // small measure to prevent garbage data

        tempInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) {
                reject("No file provided");
            }

            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });

        tempInput.click();
    });
}

export const SERVER_URL = "http://localhost:8081/";
