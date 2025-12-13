import { useState } from 'react'

const CommentFilter = () => {
    const [limit, setLimit] = useState<number>(10);

    return (
        <div className='relative'>
            <select
                className="px-3 py-1 border border-neutral-300 rounded-md outline-none text-xs cursor-pointer text-neutral-700"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
            >
                <option value={10}>5 per Comments</option>
                <option value={20}>10 per Comments</option>
                <option value={50}>15 per Comments</option>
                <option value={100}>20 per Comments</option>
            </select>
        </div>
    )
}

export default CommentFilter