import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const mockCancelBooking = vi.fn()
const mockGetMyBookings = vi.fn()

vi.mock('../api/bookings', () => ({
  getMyBookings:     () => mockGetMyBookings(),
  cancelBooking:     (id) => mockCancelBooking(id),
  rescheduleBooking: vi.fn(() => Promise.resolve({ data: { data: { booking: {} } } })),
}))

vi.mock('../api/reviews', () => ({
  createReview: vi.fn(() => Promise.resolve({ data: {} })),
}))

vi.mock('../store/authStore', () => ({
  default: () => ({ user: { name: 'Test User', email: 'test@test.com' } }),
}))

vi.mock('../components/ui/Spinner', () => ({
  default: () => <div data-testid="spinner" />,
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const PENDING_BOOKING = {
  _id: 'booking-1',
  status: 'pending',
  car: { _id: 'car-1', name: 'Toyota Corolla', brand: 'Toyota', type: 'sedan', images: [] },
  pickupDate: new Date('2025-07-01').toISOString(),
  dropDate:   new Date('2025-07-05').toISOString(),
  totalPrice: 5000,
  isReviewed: false,
}

function renderDashboard() {
  return render(<MemoryRouter><Dashboard /></MemoryRouter>)
}

describe('Dashboard cancel booking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetMyBookings.mockResolvedValue({ data: { data: { bookings: [PENDING_BOOKING] } } })
  })

  test('cancel button shows ConfirmModal instead of window.confirm', async () => {
    renderDashboard()
    // Wait for bookings to render (spinner disappears and "Toyota" appears)
    await waitFor(() => expect(screen.getByText(/toyota/i)).toBeInTheDocument(), { timeout: 3000 })

    const cancelBtn = screen.getByRole('button', { name: /^cancel$/i })
    fireEvent.click(cancelBtn)

    expect(screen.getByText(/cancel this booking/i)).toBeInTheDocument()
    expect(screen.getByText(/yes, cancel/i)).toBeInTheDocument()
    expect(screen.getByText(/keep it/i)).toBeInTheDocument()
  })

  test('dismissing the modal does not cancel the booking', async () => {
    renderDashboard()
    await waitFor(() => expect(screen.getByText(/toyota/i)).toBeInTheDocument(), { timeout: 3000 })

    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(screen.getByText(/cancel this booking/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/keep it/i))
    expect(mockCancelBooking).not.toHaveBeenCalled()
    expect(screen.queryByText(/cancel this booking/i)).toBeNull()
  })

  test('confirming modal calls cancelBooking API', async () => {
    mockCancelBooking.mockResolvedValueOnce({})
    renderDashboard()
    await waitFor(() => expect(screen.getByText(/toyota/i)).toBeInTheDocument(), { timeout: 3000 })

    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    fireEvent.click(screen.getByText(/yes, cancel/i))

    await waitFor(() => expect(mockCancelBooking).toHaveBeenCalledWith('booking-1'))
  })

  test('modal is not shown on initial render', async () => {
    renderDashboard()
    await waitFor(() => expect(screen.getByText(/my dashboard/i)).toBeInTheDocument())
    expect(screen.queryByText(/cancel this booking/i)).toBeNull()
  })
})
