import VehicleCard from "../VehicleCard/VehicleCard";

export default function VehicleSubList({
    items,
    title,
    numColumns,
    isAdmin,
    mode,
}) {
    // only exist if items
    return items.length > 0 ? (
        <div>
            <h3 className="text-center mb-3">{title}</h3>
            <div
                className={
                    "row row-cols-1 row-cols-lg-" +
                    numColumns +
                    " g-4 card-deck"
                }
            >
                {items.map((vehicle) => (
                    <div className="col" key={vehicle._id}>
                        <VehicleCard
                            isAdmin={isAdmin}
                            vehicle={vehicle}
                            mode={mode}
                        />
                    </div>
                ))}
            </div>
        </div>
    ) : null;
}
