import { useState } from 'react'

import { logger } from 'app/utils'

// Define the type for the options parameter
interface UseMutationOptions<T> {
  onMutate?: (variables: T) => Promise<any> | void // Capture current state
  onError?: (error: any, previousState?: any) => Promise<void> | void // Handle error with previous state
  onSuccess?: (data: any) => Promise<void> | void // Handle success
  rollback?: boolean // Enable rollback
}

// Define the type for the fetch function
type FetchFunction<T> = (variables: T) => Promise<any>

export const useMutation = <T>(
  fetchFunction: FetchFunction<T>,
  options: UseMutationOptions<T> = {},
) => {
  const { onError, onMutate, onSuccess, rollback = false } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null) // Adjust type as needed

  const mutate = async (variables: T) => {
    setLoading(true)
    setError(null)
    let currentState: any = null // Store current state for rollback
    let rollbackFunction: (() => void) | null = null // Initialize rollback function

    // Call onMutate if defined
    if (onMutate) {
      currentState = await onMutate(variables) // Capture the current state
      rollbackFunction = () => {
        logger.log('Restoring to old state:', currentState)
      }
    }

    try {
      const response = await fetchFunction(variables)
      if (onSuccess) {
        await onSuccess(response.data)
      }
    } catch (err) {
      setError(err)

      // Handle rollback if rollback is true and rollbackFunction is defined
      if (rollback && rollbackFunction) {
        rollbackFunction() // Call the rollback function to revert changes
      }

      // Call onError with the error and previous state if rollback is enabled
      if (onError) {
        await onError(err, currentState) // Pass previous state only if rollback is true
      }
    } finally {
      setLoading(false)
    }
  }

  return { error, loading, mutate }
}
