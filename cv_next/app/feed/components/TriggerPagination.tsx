"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

export default function TriggerPagination({
  callbackTrigger,
}: {
  callbackTrigger: () => Promise<void>
}) {
  const [triggerRef, inView] = useInView()

  useEffect(() => {
    if (inView) {
      callbackTrigger()
    }
  }, [callbackTrigger, inView])

  //TODO: replace with proper spinner
  return (
    <div ref={triggerRef} className="z-10 flex justify-center">
      <div>Loading...</div>
    </div>
  )
}
