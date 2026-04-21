import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { VehicleWithDepartment } from "$lib/types/bonus";
import type { Vehicle } from "$lib/types/db";

export async function getVehiclesByOrganizationId(
	organizationId: string,
	includeArchived: boolean = false,
) {
	try {
		const rows = await sql<VehicleWithDepartment[]>`
            SELECT
                v.id,
                v.number,
                v.name,
                v.department_id,
                v.mileage,
                v.has_image,
                v.archived,
                v.created_at,
                v.updated_at,
                d.name AS department_name,
                d.id AS department_id,
                (
                    SELECT s.username
                    FROM trip t
                    INNER JOIN account s ON t.started_by = s.id
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                    ORDER BY t.start_time DESC
                    LIMIT 1
                ) AS started_by_username,
                (
                    SELECT s.name
                    FROM trip t
                    INNER JOIN account s ON t.started_by = s.id
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                    ORDER BY t.start_time DESC
                    LIMIT 1
                ) AS started_by_name,
                (
                    SELECT string_agg(dest.name, ', ' ORDER BY td.position)
                    FROM trip_destination td
                    INNER JOIN destination dest ON td.destination_id = dest.id
                    INNER JOIN trip t ON td.trip_id = t.id
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                ) AS destinations,
                EXISTS (
                    SELECT 1
                    FROM trip t
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                ) AS is_checked_out,
                o.id AS organization_id,
                (
                    SELECT count(*)
                    FROM trip_destination td
                    INNER JOIN trip t ON t.id = td.trip_id
                    WHERE t.vehicle_id = v.id
                )::int AS trip_count
            FROM
                vehicle v
            INNER JOIN
                department d ON v.department_id = d.id
            INNER JOIN organization o ON d.organization_id = o.id
            WHERE
                d.organization_id = ${organizationId}
                AND (v.archived = false OR ${includeArchived})
            ORDER BY
                d.position, v.number
        `;

		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getVehicleById(id: string) {
	try {
		const [row] = await sql<Vehicle[]>`
            SELECT
                id,
                number,
                name,
                department_id,
                mileage,
                has_image,
                archived,
                created_at,
                updated_at
            FROM
                vehicle
            WHERE
                id = ${id}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getVehicleByNumber(number: string) {
	try {
		const [row] = await sql<VehicleWithDepartment[]>`
            SELECT
                v.id,
                v.number,
                v.name,
                v.department_id,
                v.mileage,
                v.has_image,
                v.archived,
                v.created_at,
                v.updated_at,
                d.name AS department_name,
                d.id AS department_id,
                (
                    SELECT s.username
                    FROM trip t
                    INNER JOIN account s ON t.started_by = s.id
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                    ORDER BY t.start_time DESC
                    LIMIT 1
                ) AS started_by_username,
                (
                    SELECT s.name
                    FROM trip t
                    INNER JOIN account s ON t.started_by = s.id
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                    ORDER BY t.start_time DESC
                    LIMIT 1
                ) AS started_by_name,
                (
                    SELECT string_agg(dest.name, ', ' ORDER BY td.position)
                    FROM trip_destination td
                    INNER JOIN destination dest ON td.destination_id = dest.id
                    INNER JOIN trip t ON td.trip_id = t.id
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                ) AS destinations,
                EXISTS (
                    SELECT 1
                    FROM trip t
                    WHERE t.vehicle_id = v.id AND t.end_time IS NULL
                ) AS is_checked_out,
                o.id AS organization_id
            FROM
                vehicle v
            INNER JOIN
                department d ON v.department_id = d.id
            INNER JOIN organization o ON d.organization_id = o.id
            WHERE
                v.number = ${number}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function createVehicle(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) {
	const id = generateTextId();
	try {
		const [row] = await sql<Vehicle[]>`
            INSERT INTO vehicle (id, number, name, department_id, mileage, has_image, archived, created_at, updated_at)
            VALUES (${id}, ${vehicle.number}, ${vehicle.name}, ${vehicle.departmentId}, ${vehicle.mileage}, ${vehicle.hasImage}, ${vehicle.archived}, NOW(), NULL)
            RETURNING
                id,
                number,
                name,
                department_id,
                mileage,
                has_image,
                archived,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function updateVehicle(
	id: string,
	vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">,
) {
	try {
		const [row] = await sql<Vehicle[]>`
            UPDATE vehicle
            SET
                number = ${vehicle.number},
                name = ${vehicle.name},
                department_id = ${vehicle.departmentId},
                mileage = ${vehicle.mileage},
                has_image = ${vehicle.hasImage},
                archived = ${vehicle.archived},
                updated_at = NOW()
            WHERE
                id = ${id}
            RETURNING
                id,
                number,
                name,
                department_id,
                mileage,
                has_image,
                archived,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function deleteVehicle(id: string) {
	try {
		await sql`
            DELETE FROM vehicle
            WHERE id = ${id}
        `;
	} catch (err) {
		throw parsePgError(err);
	}
}
