"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import Categories from "@/types/models/categories";
import { generateCategoryLink } from "@/lib/utils";

interface CategoriesDisplayProps {
    categories: number[]
}

export default function CategoriesDisplay({ categories }: CategoriesDisplayProps) {1
    const [thisElement, setThisElement] = useState<HTMLDivElement | null>();
    
    const [displayedCatagories, setDisplayedCatagories] = useState<number[]>(categories);
    const [overFlowingCatagories, setOverFlowingCatagories] = useState<number[]>([]);
    const [savedWidth, setSavedWidth] = useState<number>();

    const windowSize = useWindowSize()
    
    
    useEffect(() => {
        if(thisElement && thisElement.clientWidth < thisElement.scrollWidth) {
            const overflowCatagory =  displayedCatagories[displayedCatagories.length - 1]
            
            setOverFlowingCatagories([overflowCatagory, ...overFlowingCatagories])
            setDisplayedCatagories(displayedCatagories.slice(0, -1))
        }
    }, [thisElement, categories, displayedCatagories, overFlowingCatagories])

    useEffect(() => {
        if(windowSize && savedWidth !== windowSize.width) {
            resetCatagoriesArray()
            setSavedWidth(windowSize.width)
        }
    }, [windowSize])

    const resetCatagoriesArray = () => {
        setDisplayedCatagories(categories)
        setOverFlowingCatagories([])
    }

    const shiftTheCatagories = () => {
        const overflowCatagory =  overFlowingCatagories[overFlowingCatagories.length - 1]
        const displayedCatagory =  displayedCatagories[displayedCatagories.length - 1]

        setOverFlowingCatagories([displayedCatagory, ...overFlowingCatagories.slice(0, -1)])
        setDisplayedCatagories([overflowCatagory, ...displayedCatagories.slice(0, -1)])
    }

    return <>
        <div className="mt-2 flex space-x-2 overflow-visible" ref={(el => setThisElement(el))}>
            {displayedCatagories.map((categoryId) => (
                <CategoryDisplay key={categoryId} categoryId={categoryId} />
            ))}
            { overFlowingCatagories.length && <OverflowNumber categories={overFlowingCatagories} onClick={shiftTheCatagories}/> }
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
                {getCatagoryText(categoryId)}
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
            className="rounded-full bg-gray-700 px-2 py-1 text-sm font-semibold text-white hover:bg-gray-400 flex justify-center items-center"
            title={categories.map(getCatagoryText).join(", ")}
            >
                +{categories.length}
        </div>
    </>
}

function getCatagoryText(id: number) {
    return `#${Categories.category[id]}`
}

