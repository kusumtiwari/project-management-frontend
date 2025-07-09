// NoData.tsx
import Lottie from "lottie-react";
import noDataAnimation from "../../../assets/animations.json"; // adjust the path

export default function NoData() {
    return (
        <div className="flex flex-col items-center justify-center py-10 bg-transparent">
            <div className="w-60 h-60">
                <Lottie animationData={noDataAnimation} loop autoplay />
            </div>
            <p className="text-gray-500 mt-4 text-center">No data found.</p>
        </div>
    );
}
