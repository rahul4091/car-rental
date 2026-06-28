import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Register from '../pages/Register'

vi.mock('../store/authStore', () => ({
  default: () => ({ register: vi.fn(), isLoading: false }),
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

describe('Register page', () => {
  function renderRegister() {
    return render(<MemoryRouter><Register /></MemoryRouter>)
  }

  test('password field has placeholder "Min. 8 characters"', () => {
    renderRegister()
    const passwordInput = screen.getByPlaceholderText('Min. 8 characters')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('placeholder is not "Min. 6 characters" (old incorrect value)', () => {
    renderRegister()
    expect(screen.queryByPlaceholderText('Min. 6 characters')).toBeNull()
  })

  test('renders name, email, phone, and password fields', () => {
    renderRegister()
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('+91 9876543210')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Min. 8 characters')).toBeInTheDocument()
  })
})
