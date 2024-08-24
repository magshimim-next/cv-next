"use client";

import CVItemLink from "@/app/feed/components/CVItemLink";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import CVItem from "./CVItem";
import { CvsContext, CvsDispatchContext } from "@/providers/cvs-provider";
import { ReloadButton } from "@/components/ui/reloadButton";
import Definitions, { API_DEFINITIONS } from "@/lib/definitions";
import { useInView } from "react-intersection-observer";
import { FilterPanel } from "@/app/feed/components/filterPanel";
import ReactLoading from "react-loading";
import { filterValues } from "@/types/models/filters";
import { useApiFetch } from "@/hooks/useAPIFetch";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Categories from "@/types/models/categories";

function toCategory(name: string):number {
  return Categories.category[name as keyof typeof Categories.category];
}

function categoryString(num:number){
  const categoryNames = [
    'Undefined',
    'General',
    'Medical',
    'Insurance',
    'Financial',
    'Legal',
    'Education',
    'Fullstack',
    'Frontend',
    'Backend',
    'Devops',
    'Cybersecurity'
  ];
  return categoryNames[num];
}


export default function Feed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const optionalCategory = searchParams.getAll("category").map(toCategory);
  const optionalDescription = searchParams.get("description");
  const cvsContextConsumer = useContext(CvsContext);
  const cvsDispatchContextConsumer = useContext(CvsDispatchContext);
  const initialCvs = cvsContextConsumer.cvs?.length
    ? cvsContextConsumer.cvs
    : [];

  const [cvs, setCvs] = useState<CvModel[]>(initialCvs);
  const cvsRef = useRef<CvModel[] | null>();
  const page = useRef<number>(
    cvsContextConsumer.cvs?.length
      ? cvsContextConsumer.page
      : Definitions.PAGINATION_INIT_PAGE_NUMBER
  );
  const [loadMore, setLoadMore] = useState(true);
  const [filters, setFilters] = useState<filterValues>({
    searchValue: (optionalDescription) ? optionalDescription : "",
    categoryId: (optionalCategory) ? optionalCategory: null,
  });
  const fetchFromApi = useApiFetch();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  /**
   * Trigger pagination when this element comes into view.
   *
   * @param {Function} callbackTrigger - A function that triggers pagination when called
   * @return {JSX.Element} A div element with a ref for triggering pagination
   */
  function TriggerPagination({
    callbackTrigger,
  }: {
    callbackTrigger: () => Promise<void>;
  }) {
    const [triggerRef, inView] = useInView();

    useEffect(() => {
      if (inView) {
        callbackTrigger();
      }
    }, [callbackTrigger, inView]);

    return <div ref={triggerRef}></div>;
  }

  useEffect(() => {
    cvsRef.current = cvs;
  }, [cvs]);

  const fetchCvsCallback = useCallback(async () => {
    if (loadMore) {
      const nextPage = page.current + 1;
      if(optionalCategory){
        if(filters.categoryId){
          filters.categoryId  = [...new Set(filters.categoryId.concat(optionalCategory))];
        }
        else {
          filters.categoryId = optionalCategory;
        }
      }
      const response = await fetchFromApi(
        API_DEFINITIONS.CVS_API_BASE,
        API_DEFINITIONS.FETCH_CVS_ENDPOINT,
        {
          nextPage,
          filters,
        }
      );

      if (response && response.cvs.length > 0) {
        setCvs((prevCvs) => [...prevCvs, ...response.cvs]);
        page.current = nextPage;
      } else {
        setLoadMore(false);
      }
      if(filters.categoryId){
        params.delete("category");
        filters.categoryId.map((category) => {
          params.append("category", categoryString(category));
        })
        
        router.replace(`${pathname}?${params}`);
      }
    }
  }, [loadMore, filters, fetchFromApi]);

  const debouncedFetchCvsCallback = useCallback(async () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    return new Promise<void>((resolve) => {
      debounceTimeout.current = setTimeout(async () => {
        await fetchCvsCallback();
        resolve();
      }, 300); // Adjust delay as needed
    });
  }, [fetchCvsCallback]);

  useEffect(() => {
    //before unmount, save current cvs state to context for smoother navigation
    //TODO: add time-based revalidation for context
    return () => {
      if (cvsRef.current) {
        cvsDispatchContextConsumer({
          type: `replace`,
          payload: { cvs: cvsRef.current, page: page.current },
        });
      }
    };
  }, [cvsDispatchContextConsumer]);

  const forceReload = useCallback(() => {
    cvsDispatchContextConsumer({
      type: `reset`,
      payload: {
        cvs: [],
        page: Definitions.PAGINATION_INIT_PAGE_NUMBER,
      },
    });
    setCvs([]);
    page.current = Definitions.PAGINATION_INIT_PAGE_NUMBER;
    setLoadMore(true);
  }, [cvsDispatchContextConsumer]);

  useEffect(() => {
    forceReload();
  }, [filters, forceReload]);

  const onFilterChange = useCallback((filters: filterValues) => {
    setFilters(filters);
  }, []);

  useEffect(() => {
    debouncedFetchCvsCallback();
  }, [debouncedFetchCvsCallback]);

  return (
    <main>
      <ScrollToTop />
      <FilterPanel
        defaultFilters={filters}
        cvs={cvs}
        onChange={onFilterChange}
      ></FilterPanel>
      <div className="container mx-auto space-y-8 p-6">
        <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {cvs ? (
            cvs.map((cv) => (
              <CVItemLink key={cv.id} cv={cv}>
                <CVItem cv={cv} />
              </CVItemLink>
            ))
          ) : (
            <></>
          )}
          <TriggerPagination callbackTrigger={debouncedFetchCvsCallback} />
        </div>
        {!loadMore ? (
          <div className="text-center">
            {cvs.length ? (
              <div className="sticky bottom-5 z-10 flex justify-center">
                <ReloadButton callback={forceReload}>Reload</ReloadButton>
              </div>
            ) : (
              <p>No CVs found that matched your filters</p>
            )}
          </div>
        ) : (
          <div className="z-10 flex justify-center">
            <ReactLoading
              type={"spinningBubbles"}
              color={"#000"}
              height={"40%"}
              width={"40%"}
            />
          </div>
        )}
      </div>
    </main>
  );
}
