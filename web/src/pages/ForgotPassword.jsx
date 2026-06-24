import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, ArrowLeft } from 'lucide-react'
import { forgotPassword, verifyOtp, resetPassword } from '../api/auth'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword(email)
      toast.success('OTP sent to your email')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await verifyOtp({ email, otp })
      setResetToken(data.data.resetToken)
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await resetPassword({ resetToken, password })
      toast.success('Password reset! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-blue-700 font-bold text-xl mb-2">
            <Car className="w-6 h-6" /> DriveEase
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 1 && 'Forgot password'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'New password'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 && "We'll send an OTP to your email"}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && 'Choose a strong new password'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white font-medium py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                placeholder="6-digit code"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-blue-700 text-white font-medium py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-gray-700">
              ← Use a different email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white font-medium py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-blue-700 font-medium hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
