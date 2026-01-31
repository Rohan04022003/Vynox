const MyVideoCard = (key: number) => {
    return (
        <div
            key={key}
            className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow"
        >
            <div className="h-40 bg-gray-200" />
            <div className="p-3">
                <p className="text-sm font-medium">Sample Video Title</p>
                <p className="text-xs text-gray-500 mt-1">1k views • 2 days ago</p>
            </div>
        </div>
    )
}

export default MyVideoCard