"use client";

import Link from "next/link";
import Categories from "@/types/models/categories";
import { generateCategoryLink } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CategoriesDisplayProps {
    categories: number[]
}

export default function CategoriesDisplay({ categories }: CategoriesDisplayProps) {1
    const [thisElement, setThisElement] = useState<HTMLDivElement | null>();
    
    const [displayedCatagories, setDisplayedCatagories] = useState<number[]>(categories);
    const [overFlowingCatagories, setOverFlowingCatagories] = useState<number[]>([]);
    
    useEffect(() => {
        if(thisElement) {
            if(thisElement.clientWidth < thisElement.scrollWidth) {
                const overflowCatagory =  displayedCatagories[displayedCatagories.length - 1]
                setOverFlowingCatagories([...overFlowingCatagories, overflowCatagory])
                setDisplayedCatagories(displayedCatagories.slice(0, -1))
            }
        }
    }, [thisElement])

    return <>
        <div className="mt-2 flex space-x-2" ref={(el => setThisElement(el))}>
            {displayedCatagories.map((categoryId) => (
                <CategoryDisplay categoryId={categoryId} />
            ))}
            { overFlowingCatagories.length && <OverflowNumber categories={overFlowingCatagories}/> }
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
                #{Categories.category[categoryId]}
            </div>
        </Link>
    </>
}

function OverflowNumber({ categories }: {categories: number[]} ) {
    return <>
        <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400"
            title={categories.map(categoryId => `#${Categories.category[categoryId]}`).join(" ")}
            >
                +{categories.length}
        </div>
    </>
}

