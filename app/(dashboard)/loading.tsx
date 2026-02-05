export default function Loading() {
    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 bg-neutral-50 animate-pulse">
            <div className="h-20 w-full bg-neutral-200 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 bg-neutral-200 rounded-3xl" />
                <div className="h-64 bg-neutral-200 rounded-3xl" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-neutral-200 rounded-3xl" />
                ))}
            </div>
        </div>
    );
}
