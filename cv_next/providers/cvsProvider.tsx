"use client"

import { createContext, useReducer } from "react"
import Definitions from "@/lib/definitions"

const initialValue: PaginatedCvsModel = {
  cvs: [],
  page: Definitions.PAGINATION_INIT_PAGE_NUMBER,
}

export const CvsContext = createContext(initialValue)
export const CvsDispatchContext = createContext((action: CvAction) => {})

/**
 * CvsProvider component that provides the CVS state and dispatcher to its children.
 * The purposae of this component is to provide basic caching functionality for the cvs in the feed page.
 *
 * @param {Object} children - The child components to be wrapped by the provider
 * @return {JSX.Element} JSX element containing the context providers and children
 */
export const CvsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cvsReducer, {
    cvs: initialValue.cvs,
    page: initialValue.page,
  })
  return (
    <CvsContext.Provider value={state}>
      <CvsDispatchContext.Provider value={dispatch}>
        {children}
      </CvsDispatchContext.Provider>
    </CvsContext.Provider>
  )
}

type CvAction = {
  type: string
  payload: PaginatedCvsModel
}

/**
 * Reduces the state based on the given action type.
 *
 * @param {PaginatedCvsModel} state - The current state
 * @param {CvAction} action - The action to be performed
 * @return {PaginatedCvsModel} The new state after reducing based on the action
 */
function cvsReducer(state: PaginatedCvsModel, action: CvAction) {
  switch (action.type) {
    case "replace": {
      return {
        cvs: action.payload.cvs,
        page: action.payload.page,
      }
    }
    case "reset": {
      return {
        cvs: [],
        page: Definitions.PAGINATION_INIT_PAGE_NUMBER,
      }
    }
    default: {
      return state
    }
  }
}
