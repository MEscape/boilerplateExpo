import React from 'react'

import { render } from '@testing-library/react-native'

import { Text } from './Text'

// Mock useColor to return default color values
jest.mock('app/context', () => ({
  useColor: () => ({
    colors: {
      text: '#000000', // or any default color you expect in your app
    },
  }),
}))

// Mock scaledSize to simply return the same value passed in
jest.mock('app/utils', () => ({
  scaledSize: jest.fn(size => size),
}))

const testText = 'Test string'

describe('Text', () => {
  it('should render the component', () => {
    const { getByText } = render(<Text text={testText} />)
    expect(getByText(testText)).toBeDefined()
  })
})
