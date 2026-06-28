import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmModal from '../components/ui/ConfirmModal'

describe('ConfirmModal', () => {
  const onConfirm = vi.fn()
  const onCancel  = vi.fn()

  beforeEach(() => { vi.clearAllMocks() })

  test('renders message and both buttons', () => {
    render(<ConfirmModal message="Are you sure?" onConfirm={onConfirm} onCancel={onCancel} />)
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('Keep it')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
  })

  test('uses custom confirmLabel', () => {
    render(<ConfirmModal message="Delete?" confirmLabel="Yes, delete" onConfirm={onConfirm} onCancel={onCancel} />)
    expect(screen.getByText('Yes, delete')).toBeInTheDocument()
  })

  test('calls onCancel when "Keep it" is clicked', () => {
    render(<ConfirmModal message="Delete?" onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Keep it'))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  test('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmModal message="Cancel booking?" confirmLabel="Yes, cancel" onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Yes, cancel'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  test('renders as a fixed overlay', () => {
    const { container } = render(<ConfirmModal message="Test" onConfirm={onConfirm} onCancel={onCancel} />)
    const overlay = container.firstChild
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50')
  })
})
