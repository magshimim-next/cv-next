export const CommentSkeleton = () => {
    return (
        <article className="p-6 mb-3 border-b border-gray-200 rounded-lg bg-white dark:bg-gray-900 animate-pulse">
            <div className="h-2.5 mb-4 bg-gray-200 rounded-full dark:bg-gray-700 w-24"/>
            <p className="h-2.5 mb-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
            <p className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
        </article>
    )
}