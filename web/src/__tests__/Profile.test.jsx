import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Profile from '../pages/Profile'

const mockGetMyReviews = vi.fn()
const mockDeleteReview = vi.fn()

vi.mock('../api/users', () => ({
  getProfile:          vi.fn(() => Promise.resolve({ data: { data: { user: { name: 'Alice', email: 'alice@test.com', phone: '', address: {}, drivingLicense: {} } } } })),
  updateProfile:       vi.fn(() => Promise.resolve({ data: { data: { user: {} } } })),
  changePassword:      vi.fn(() => Promise.resolve({ data: {} })),
  saveCar:             vi.fn(() => Promise.resolve({ data: {} })),
  updateDrivingLicense: vi.fn(() => Promise.resolve({ data: {} })),
}))

vi.mock('../api/reviews', () => ({
  getMyReviews:  () => mockGetMyReviews(),
  updateReview:  vi.fn(() => Promise.resolve({ data: {} })),
  deleteReview:  (id) => mockDeleteReview(id),
}))

vi.mock('../api/client', () => ({
  default: { post: vi.fn(() => Promise.resolve({ data: {} })) },
}))

vi.mock('../store/authStore', () => ({
  default: () => ({
    user: { name: 'Alice', email: 'alice@test.com', avatar: null },
    setUser: vi.fn(),
  }),
}))

vi.mock('../components/ui/Spinner', () => ({
  default: () => <div data-testid="spinner" />,
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const MOCK_REVIEWS = [
  { _id: 'rev-1', car: { name: 'Honda City' }, rating: 4, comment: 'Great car!', createdAt: new Date().toISOString() },
]

function renderProfile() {
  return render(<MemoryRouter><Profile /></MemoryRouter>)
}

async function navigateToReviews() {
  const reviewsTab = await screen.findByRole('button', { name: /my reviews/i })
  fireEvent.click(reviewsTab)
}

describe('Profile — My Reviews tab', () => {
  beforeEach(() => { vi.clearAllMocks() })

  test('reviews load automatically when tab is opened (no manual button needed)', async () => {
    mockGetMyReviews.mockResolvedValue({ data: { data: { reviews: MOCK_REVIEWS } } })
    renderProfile()
    await navigateToReviews()
    await waitFor(() => expect(mockGetMyReviews).toHaveBeenCalledTimes(1))
  })

  test('getMyReviews is not called again when switching away and back to reviews tab', async () => {
    mockGetMyReviews.mockResolvedValue({ data: { data: { reviews: MOCK_REVIEWS } } })
    renderProfile()
    await navigateToReviews()
    await waitFor(() => expect(mockGetMyReviews).toHaveBeenCalledTimes(1))

    // Switch away to Personal Info
    const infoTab = screen.getByRole('button', { name: /personal info/i })
    fireEvent.click(infoTab)
    // Switch back to Reviews
    const reviewsTab = screen.getByRole('button', { name: /my reviews/i })
    fireEvent.click(reviewsTab)

    // Should still only be called once
    expect(mockGetMyReviews).toHaveBeenCalledTimes(1)
  })

  test('shows empty state when reviews array is empty', async () => {
    mockGetMyReviews.mockResolvedValue({ data: { data: { reviews: [] } } })
    renderProfile()
    await navigateToReviews()
    await waitFor(() => expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument())
  })

  test('delete button opens ConfirmModal instead of window.confirm', async () => {
    mockGetMyReviews.mockResolvedValue({ data: { data: { reviews: MOCK_REVIEWS } } })
    renderProfile()
    await navigateToReviews()
    await waitFor(() => expect(screen.getByText('Great car!')).toBeInTheDocument())

    const deleteBtn = screen.getByTitle(/delete review/i)
    fireEvent.click(deleteBtn)

    expect(screen.getByText(/delete this review/i)).toBeInTheDocument()
    expect(screen.getByText(/yes, delete/i)).toBeInTheDocument()
    expect(screen.getByText('Keep it')).toBeInTheDocument()
  })

  test('dismissing delete modal does not call deleteReview', async () => {
    mockGetMyReviews.mockResolvedValue({ data: { data: { reviews: MOCK_REVIEWS } } })
    renderProfile()
    await navigateToReviews()
    await waitFor(() => expect(screen.getByText('Great car!')).toBeInTheDocument())

    fireEvent.click(screen.getByTitle(/delete review/i))
    fireEvent.click(screen.getByText('Keep it'))

    expect(mockDeleteReview).not.toHaveBeenCalled()
    expect(screen.queryByText(/delete this review/i)).toBeNull()
  })

  test('confirming delete calls deleteReview with correct id', async () => {
    mockDeleteReview.mockResolvedValue({})
    mockGetMyReviews.mockResolvedValue({ data: { data: { reviews: MOCK_REVIEWS } } })
    renderProfile()
    await navigateToReviews()
    await waitFor(() => expect(screen.getByText('Great car!')).toBeInTheDocument())

    fireEvent.click(screen.getByTitle(/delete review/i))
    fireEvent.click(screen.getByText(/yes, delete/i))

    await waitFor(() => expect(mockDeleteReview).toHaveBeenCalledWith('rev-1'))
  })
})
