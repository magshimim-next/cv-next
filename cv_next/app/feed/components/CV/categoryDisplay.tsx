"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import Categories from "@/types/models/categories";
import { generateCategoryLink } from "@/lib/utils";

interface CategoriesDisplayProps {
    categories: number[]
}

export default function CategoriesDisplay({ categories }: CategoriesDisplayProps) {
    const [thisElement, setThisElement] = useState<HTMLDivElement | null>();
    
    const [displayedCategories, setDisplayedCategories] = useState<number[]>(categories);
    const [overFlowingCategories, setOverFlowingCategories] = useState<number[]>([]);
    const [savedWidth, setSavedWidth] = useState<number>();

    const windowSize = useWindowSize()
    
    
    useEffect(() => {
        if(thisElement && thisElement.clientWidth < thisElement.scrollWidth) {
            const overflowCategory =  displayedCategories[displayedCategories.length - 1]
            
            setOverFlowingCategories([overflowCategory, ...overFlowingCategories])
            setDisplayedCategories(displayedCategories.slice(0, -1))
        }
    }, [thisElement, categories, displayedCategories, overFlowingCategories])

    useEffect(() => {
        if(windowSize && savedWidth !== windowSize.width) {
            resetCategoriesArray()
            setSavedWidth(windowSize.width)
        }
    }, [windowSize, displayedCategories, overFlowingCategories, savedWidth])

    const resetCategoriesArray = () => {
        setDisplayedCategories(categories)
        setOverFlowingCategories([])
    }

    const shiftTheCategories = () => {
        const overflowCategory =  overFlowingCategories[overFlowingCategories.length - 1]
        const displayedCategory =  displayedCategories[displayedCategories.length - 1]

        setOverFlowingCategories([displayedCategory, ...overFlowingCategories.slice(0, -1)])
        setDisplayedCategories([overflowCategory, ...displayedCategories.slice(0, -1)])
    }

    return <>
        <div className="flex flex-row justify-between mt-2 space-x-2" ref={(el => setThisElement(el))}>
            <div className="flex space-x-2">
                {displayedCategories.map((categoryId) => (
                    <CategoryDisplay key={categoryId} categoryId={categoryId} />
                ))}
            </div>
            { overFlowingCategories.length ? <OverflowNumber categories={overFlowingCategories} onClick={shiftTheCategories}/> : <></> }
        </div>
    </>
}

function CategoryDisplay({ categoryId }: {categoryId: number;} ) {
    return <>
        <Link href={generateCategoryLink(categoryId)}>
            <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
            >
                {getCategoryText(categoryId)}
            </div>
        </Link>
    </>
}

function OverflowNumber({ categories, onClick }: {categories: number[], onClick: () => void} ) {
    return <>
        <div
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            className="rounded-full bg-gray-700 px-2 py-1 text-sm font-semibold text-white hover:bg-gray-400 flex justify-center items-center right-0"
            title={categories.map(getCategoryText).join(", ")}
            >
                +{categories.length}
        </div>
    </>
}

function getCategoryText(id: number) {
    return `#${Categories.category[id]}`
}

