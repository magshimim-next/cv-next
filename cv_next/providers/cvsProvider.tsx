"use client"

import { createContext, useReducer } from "react"

const initialValue: CvModel[] = []

export const CvsContext = createContext({ cvs: initialValue })
export const CvsDispatchContext = createContext((action: CvAction) => {})

export const CvsProvider = ({ children }: { children: React.ReactNode }) => {
  const [cvs, dispatch] = useReducer(cvsReducer, { cvs: initialValue })

  return (
    <CvsContext.Provider value={cvs}>
      <CvsDispatchContext.Provider value={dispatch}>
        {children}
      </CvsDispatchContext.Provider>
    </CvsContext.Provider>
  )
}

type CvAction = {
  type: string
  payload: CvModel[]
}

type CvState = {
  cvs: CvModel[]
}

function cvsReducer(state: CvState, action: CvAction) {
  console.log(action)

  switch (action.type) {
    case "push": {
      return {
        ...state,
        cvs: [...state.cvs, ...action.payload],
      }
    }
    case "replace": {
      return {
        ...state,
        cvs: action.payload,
      }
    }
    case "reset": {
      return {
        ...state,
        cvs: [],
      }
    }
    default: {
      return state
    }
  }
}
