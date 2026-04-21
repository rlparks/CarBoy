import { form, getRequestEvent, query } from "$app/server";
import UniqueConstraintViolation from "$lib/server/db/error/UniqueConstraintViolation";
import { getDepartmentById } from "$lib/server/db/queries/department";
import { getDestinationByName as getDestDb } from "$lib/server/db/queries/destination";
import { checkoutVehicle, getTrips } from "$lib/server/db/queries/trip";
import { getVehicleById } from "$lib/server/db/queries/vehicle";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const checkout = form(
	v.strictObject(
		{
			vehicleId: v.string(),
			destinationIds: v.array(v.string()),
			note: v.optional(v.pipe(v.string(), v.trim())),
		},
		"At least one destination is required.",
	),
	async ({ vehicleId, destinationIds, note }) => {
		const event = getRequestEvent();
		event.locals.security.enforceAuthenticated();

		const vehicle = await getVehicleById(vehicleId);

		if (!vehicle) {
			return error(404, "Vehicle not found");
		}

		const department = await getDepartmentById(vehicle.departmentId);
		if (!department || department.organizationId !== event.locals.session?.selectedOrganizationId) {
			return error(403, "Incorrect organization selected");
		}

		if (vehicle.archived) {
			return error(400, "Vehicle is archived.");
		}

		const [mostRecentTrip] = await getTrips({ vehicleNumber: vehicle.number, limit: 1 });
		if (mostRecentTrip && !mostRecentTrip.endTime) {
			return invalid("Vehicle is already checked out.");
		}

		try {
			await checkoutVehicle(event.locals.account!.id, vehicle.id, destinationIds, note);
		} catch (err) {
			if (err instanceof UniqueConstraintViolation && err.constraintViolated === "vehicle_id") {
				return invalid("Vehicle is already checked out.");
			}
			console.error(err);
			return error(500, "Something went wrong while creating the trip");
		}

		return redirect(303, "/?success=checkout");
	},
);

export const getDestinationByName = query(v.string(), async (name) => {
	const event = getRequestEvent();
	event.locals.security.enforceAuthenticated();

	const destination = await getDestDb(name);

	return destination;
});
