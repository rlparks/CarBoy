export default function Title() {
    return (
        <div className="d-flex flex-row">
            <img
                src="/carboy-icon.png"
                alt="CarBoy"
                width="50px"
                height="50px"
            />
            <div className="d-flex flex-column justify-content-center">
                <h1 style={{ fontSize: "2.5rem" }}>CarBoy</h1>
            </div>
        </div>
    );
}
