export const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const totalMinutes = 6 * 60 + i * 30
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
})

export const HOUR_OPTIONS = [1, 2, 3, 4, 6, 8, 12]
