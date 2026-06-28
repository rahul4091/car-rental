import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Contact from '../pages/Contact'

vi.mock('../api/client', () => ({
  default: { post: vi.fn() },
}))

import api from '../api/client'

describe('Contact page', () => {
  beforeEach(() => { vi.clearAllMocks() })

  function fillForm(email = 'user@example.com') {
    fireEvent.change(screen.getByPlaceholderText('Rahul Sharma'), {
      target: { name: 'name', value: 'Alice' },
    })
    fireEvent.change(screen.getByPlaceholderText('rahul@example.com'), {
      target: { name: 'email', value: email },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { name: 'subject', value: 'Booking Inquiry' },
    })
    fireEvent.change(screen.getByPlaceholderText(/how we can help/i), {
      target: { name: 'message', value: 'Hello there!' },
    })
  }

  test('success screen shows the submitted email address', async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    render(<Contact />)
    fillForm('alice@driveease.com')
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/alice@driveease\.com/)).toBeInTheDocument()
  })

  test('success screen email is correct even after form state is cleared', async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    render(<Contact />)
    fillForm('test@example.com')
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument())
    // Email must be captured before form is cleared
    expect(screen.getByText(/test@example\.com/)).toBeInTheDocument()
  })

  test('shows validation error when name is empty', () => {
    render(<Contact />)
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
  })

  test('shows validation error when email is empty', async () => {
    render(<Contact />)
    // Name filled, email left empty → expects "Email is required"
    fireEvent.change(screen.getByPlaceholderText('Rahul Sharma'), {
      target: { name: 'name', value: 'Bob' },
    })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  test('does not call api when form is invalid', async () => {
    render(<Contact />)
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByText(/name is required/i)
    expect(api.post).not.toHaveBeenCalled()
  })
})
