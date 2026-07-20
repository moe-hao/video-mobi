import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";

export default function ErrorFallback() {
    const error = useRouteError();
    const navigate = useNavigate();

    const isRouteError = isRouteErrorResponse(error);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-white bg-[#1a1a1a]">
            <h1 className="text-[48px] font-bold mb-2">
                {isRouteError ? error.status : "Oops"}
            </h1>
            <p className="text-[16px] text-white/60 mb-8 text-center">
                {isRouteError
                    ? error.statusText || "Page not found"
                    : "Something went wrong. Please try again."}
            </p>
            <button
                className="px-6 py-2 rounded-[12px] bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] text-[14px] font-bold"
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </div>
    );
}
