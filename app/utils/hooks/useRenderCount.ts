import { useEffect, useRef } from 'react'

import { logger } from 'app/utils'

export const useRenderCount = (element?: string) => {
  const renderCount = useRef(1)

  useEffect(() => {
    logger.log(`Render count: ${renderCount.current} of ${element}`)
    renderCount.current += 1
  })
}
