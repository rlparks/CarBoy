import { useParams } from "react-router-dom";
import { useState } from "react";

export default function CheckoutPage() {
    const params = useParams();
    const vehicleNumber = params.vehicleNumber;

    const [destination, setDestination] = useState("");

    async function submitHandler(event) {
        event.preventDefault();
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">Checkout</h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <label className="form-label">Vehicle Number</label>
                        <input
                            disabled
                            value={vehicleNumber}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Destination</label>
                        <input
                            autoFocus
                            value={destination}
                            onChange={setDestination}
                            type="text"
                            className="form-control"
                            placeholder="STEM I"
                        />
                    </div>

                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
