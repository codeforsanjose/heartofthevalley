import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import TestComponent from '../App'

test('renders App component successfully', () => {
  const { container } = render(<TestComponent />)
  const app = container.getElementsByClassName(/App/i)
  expect(app).not.toBeNull()
})
