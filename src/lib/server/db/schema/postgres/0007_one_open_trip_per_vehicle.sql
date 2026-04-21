CREATE UNIQUE INDEX IF NOT EXISTS trip_one_open_per_vehicle
    ON trip (vehicle_id)
    WHERE end_time IS NULL;
