import { AxiosError } from 'axios'

import { getGeneralApiProblem } from './apiProblem'

test('handles connection errors', () => {
  const error = { message: 'Network Error' } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'cannot-connect',
    temporary: true,
  })
})

test('handles network errors', () => {
  const error = { message: 'Network Error' } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'cannot-connect',
    temporary: true,
  })
})

test('handles timeouts', () => {
  const error = { message: 'timeout of 0ms exceeded' } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'timeout',
    temporary: true,
  })
})

test('handles server errors', () => {
  const error = {
    response: { status: 500 },
  } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'server',
  })
})

test('handles unknown errors', () => {
  const error = { message: 'Some unknown error' } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'unknown',
    temporary: true,
  })
})

test('handles unauthorized errors', () => {
  const error = {
    response: { status: 401 },
  } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'unauthorized',
  })
})

test('handles forbidden errors', () => {
  const error = {
    response: { status: 403 },
  } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'forbidden',
  })
})

test('handles not-found errors', () => {
  const error = {
    response: { status: 404 },
  } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'not-found',
  })
})

test('handles other client errors', () => {
  const error = {
    response: { status: 418 },
  } as AxiosError
  expect(getGeneralApiProblem(error)).toEqual({
    kind: 'rejected',
  })
})

test('handles cancellation errors', () => {
  const error = { message: 'Canceled' } as AxiosError
  expect(getGeneralApiProblem(error)).toBeNull()
})
