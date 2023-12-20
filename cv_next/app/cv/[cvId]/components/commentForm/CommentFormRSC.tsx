import { RxPaperPlane } from "react-icons/rx";

export const CommentFormRSC = () => {

    return (
        <div className="py-2 pl-4 pr-2 bg-white rounded-lg rounded-t-lg border border-gray-200
                        dark:bg-gray-800 dark:border-gray-700 grid grid-cols-[90%_10%]">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea id="comment" name="comment" rows={2}
                className="flex-col row-span-2 overflow-hidden resize-y min-h-[2.5rem] leading-5 px-0 w-full text-sm
                            text-gray-900 border-0 focus:ring-0 focus:outline-none mt-2
                            dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."/>
            <button type="submit"
                className="flex-col row-start-2 col-start-2 items-center py-2.5 px-4 dark:bg-gray-800
                            dark:text-white bg-slate-50 dark:hover:bg-gray-500/50 rounded-lg focus:ring-4
                            focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-300">
                <RxPaperPlane/>
            </button>
        </div>
    )
}