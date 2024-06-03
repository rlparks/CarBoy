import VehicleCard from "../VehicleCard/VehicleCard";

export default function VehicleSubList({ items, title, numColumns, isAdmin, mode, defaultSSO }) {
    // only exist if items
    return items.length > 0 ? (
        <div className="mb-2">
            <h4 className="text-center mb-3">{title}</h4>
            <div className={"row row-cols-1 row-cols-lg-" + numColumns + " g-4 card-deck"}>
                {items.map((vehicle) => (
                    <div className="col" key={vehicle._id}>
                        <VehicleCard
                            isAdmin={isAdmin}
                            vehicle={vehicle}
                            mode={mode}
                            defaultSSO={defaultSSO}
                        />
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <p className="text-center">No vehicles are currently available.</p>
    );
}
