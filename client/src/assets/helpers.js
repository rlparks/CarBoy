import axios from "axios";
import Papa from "papaparse";

export async function getVehicleDetails(vehicleNumber, token) {
    const url = SERVER_URL + "api/vehicles/" + vehicleNumber;
    try {
        const vehicleRes = await axios.get(url, {
            headers: { "x-auth-token": token },
        });
        const vehicleData = vehicleRes.data;
        return vehicleData;
    } catch (err) {
        // console.log(err);
        return;
    }
}

// userCache is an object that stores all known users
// {<userId1>: {userObj1}, <userId2>: {userObj2}}
export async function getUser(userId, token, userCache = {}, addUserToCache) {
    // console.log("getUser: ", userCache);
    const userFromCache = userCache[userId];

    // if we know user already, no need to continue with API call
    if (userFromCache) {
        // console.log("Cache hit!");
        return userFromCache;
    }

    // if this is reached, the user is not in the cache
    try {
        const userDetails = await axios.get(
            SERVER_URL + "api/users/" + userId,
            { headers: { "x-auth-token": token } }
        );
        if (!userDetails.data) {
            userDetails.data = {
                _id: "0",
                username: "unknown",
                admin: false,
                fullName: "Unknown User",
            };
        }

        // save to cache
        if (addUserToCache) {
            addUserToCache(userId, userDetails.data);
        } else {
            console.log("No addUserToCache");
        }

        return userDetails.data;
    } catch (err) {
        // console.log(userId);
        console.log(err);
        return null;
    }
}

export async function getDestination(destinationId, token) {
    try {
        const destinationResponse = await axios.get(
            SERVER_URL + "api/destinations/" + destinationId,
            { headers: { "x-auth-token": token } }
        );
        if (!destinationResponse.data) {
            destinationResponse.data = {
                _id: "0",
                destinationName: "Unknown Destination",
            };
        }
        return destinationResponse.data;
    } catch (err) {
        // console.log(destinationId);
        // console.log(err);
        return null;
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

export function downloadCSVFileFromJSON(fileName, jsonString) {
    const csvString = Papa.unparse(jsonString);

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
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

export function sortDestinations(a, b) {
    // Sort by building number, if applicable
    if (!a.buildingNumber && b.buildingNumber) {
        return 1;
    } else if (a.buildingNumber && !b.buildingNumber) {
        return -1;
    } else if (!a.buildingNumber && !b.buildingNumber) {
        // sort destinations without numbers by name, alphabetically
        const aName = a.destinationName.toUpperCase();
        const bName = b.destinationName.toUpperCase();
        return aName < bName ? -1 : 1;
    }

    return a.buildingNumber - b.buildingNumber;
}

export function sortVehicles(a, b) {
    return a.vehicleNumber - b.vehicleNumber;
}

export function sortUsers(a, b) {
    const aName = a.username.toUpperCase();
    const bName = b.username.toUpperCase();
    return aName < bName ? -1 : 1;
}

// mutates array
export async function makeHumanReadable(
    tripsArray,
    token,
    userCache,
    addUserToCache
) {
    for (let trip of tripsArray) {
        delete trip._id;
        trip.startTime = getDateTimeFormat().format(new Date(trip.startTime));
        trip.endTime = trip.endTime
            ? getDateTimeFormat().format(new Date(trip.endTime))
            : "";

        trip.distance = trip.endMileage
            ? trip.endMileage - trip.startMileage
            : "";

        // console.log(trip);
        // set trip employee to object
        const differentOutIn = trip.employee[1]
            ? trip.employee[0] !== trip.employee[1]
            : false;

        trip.employee[0] = await getUser(
            trip.employee[0],
            token,
            userCache,
            addUserToCache
        );

        if (differentOutIn) {
            trip.employee[1] = await getUser(
                trip.employee[1],
                token,
                userCache,
                addUserToCache
            );
        } else if (trip.employee[1]) {
            trip.employee[1] = trip.employee[0];
        }

        trip.employeeOut = trip.employee[0].fullName
            ? trip.employee[0].fullName
            : trip.employee[0].username;
        trip.employeeIn = trip.employee[1] ? trip.employee[1].fullName : null;
        delete trip.employee;
        // trip.vehicleNumber = vehicleNumber;
    }
}

// what a name
// startFilter and endFilter must be formatted as YYYY-MM-DD
// such as 2024-03-14
export function filterTripsByYYYYdashMMdashDD(trips, startFilter, endFilter) {
    return trips.filter((trip) => {
        let startDate = new Date(trip.startTime);

        // set end date to trip start date if unfinished trip
        // includes these trips in cases where they may fit
        let endDate = trip.endTime ? new Date(trip.endTime) : startDate;

        const startFilterSplit = startFilter.split("-");
        const endFilterSplit = endFilter.split("-");

        // sketchy relying on this
        // not sure
        let startFilterDate = new Date(0);
        startFilterDate.setFullYear(
            startFilterSplit[0],
            startFilterSplit[1] - 1,
            startFilterSplit[2]
        );
        let endFilterDate = new Date(0);
        endFilterDate.setFullYear(
            endFilterSplit[0],
            endFilterSplit[1] - 1,
            endFilterSplit[2]
        );

        startFilterDate.setHours(0, 0, 0);
        endFilterDate.setHours(23, 59, 59);

        // oh yea, this is a .filter
        return startFilterDate <= startDate && endFilterDate >= endDate;
    });
}

// compare function for sort
// places newest trips on bottom
export function sortTripsByStartTime(tripA, tripB) {
    const tripATime = new Date(tripA.startTime).getTime();
    const tripBTime = new Date(tripB.startTime).getTime();
    return tripATime - tripBTime;
}
