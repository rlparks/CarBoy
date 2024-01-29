import axios from "axios";

export async function getVehicleDetails(vehicleNumber) {
    // TODO
    const url = "http://localhost:8081/api/vehicles/" + vehicleNumber;
    try {
        const vehicleRes = await axios.get(url);
        const vehicleData = vehicleRes.data;
        return vehicleData;
    } catch (err) {
        console.log(err);
        return;
    }
}
