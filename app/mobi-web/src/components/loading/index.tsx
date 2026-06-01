import { Spinner } from "@heroui/react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-full pt-20">
            <Spinner color="current" size="sm" />
        </div>
    )
}
