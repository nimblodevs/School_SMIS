import { useEffect, useId, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '../../utils/date.js'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' })

function toDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromDateValue(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null
}

function calendarDays(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const startOffset = (first.getDay() + 6) % 7
  const firstVisible = new Date(first.getFullYear(), first.getMonth(), 1 - startOffset)
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const visibleDayCount = Math.ceil((startOffset + dayCount) / 7) * 7
  return Array.from({ length: visibleDayCount }, (_, index) => {
    const date = new Date(firstVisible.getFullYear(), firstVisible.getMonth(), firstVisible.getDate() + index)
    return { date, value: toDateValue(date), inMonth: date.getMonth() === month.getMonth() }
  })
}

export function DatePicker({
  label,
  name,
  required = false,
  value,
  defaultValue = '',
  onChange,
  error,
  minDate,
  maxDate,
  compact = false,
  className = '',
}) {
  const generatedId = useId().replaceAll(':', '')
  const fieldId = generatedId
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value === undefined ? internalValue : value
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = fromDateValue(value ?? defaultValue)
    return new Date((selected || new Date()).getFullYear(), (selected || new Date()).getMonth(), 1)
  })
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const selectedDate = fromDateValue(currentValue)
  const todayValue = toDateValue(new Date())
  const days = calendarDays(visibleMonth)
  const earliestDate = fromDateValue(minDate)
  const latestDate = fromDateValue(maxDate)
  const earliestYear = earliestDate?.getFullYear() ?? Math.min(1900, selectedDate?.getFullYear() || 1900)
  const latestYear = latestDate?.getFullYear() ?? Math.max(2100, selectedDate?.getFullYear() || 2100)
  const firstAllowedMonth = earliestDate || new Date(earliestYear, 0, 1)
  const lastAllowedMonth = latestDate || new Date(latestYear, 11, 31)
  const years = Array.from(
    { length: latestYear - earliestYear + 1 },
    (_, index) => latestYear - index,
  )
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: index,
    label: monthFormatter.format(new Date(2000, index, 1)),
  }))
  const currentIsLatestMonth = Boolean(latestDate
    && visibleMonth.getFullYear() === latestDate.getFullYear()
    && visibleMonth.getMonth() === latestDate.getMonth())

  function isMonthOutsideRange(year, month) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    return Boolean(
      (earliestDate && lastDay < earliestDate)
      || (latestDate && firstDay > latestDate),
    )
  }

  useEffect(() => {
    if (!open) return undefined
    function closeOnOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  function changeMonth(amount) {
    setVisibleMonth((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + amount, 1)
      if (next < new Date(firstAllowedMonth.getFullYear(), firstAllowedMonth.getMonth(), 1)
        || next > new Date(lastAllowedMonth.getFullYear(), lastAllowedMonth.getMonth(), 1)) {
        return current
      }
      return next
    })
  }

  function changeVisibleMonth(monthIndex) {
    setVisibleMonth((current) => {
      const nextMonth = Number(monthIndex)
      return isMonthOutsideRange(current.getFullYear(), nextMonth)
        ? current
        : new Date(current.getFullYear(), nextMonth, 1)
    })
  }

  function changeVisibleYear(year) {
    setVisibleMonth((current) => {
      const nextYear = Number(year)
      if (!isMonthOutsideRange(nextYear, current.getMonth())) {
        return new Date(nextYear, current.getMonth(), 1)
      }
      const nextMonth = earliestDate && nextYear === earliestDate.getFullYear()
        ? earliestDate.getMonth()
        : latestDate && nextYear === latestDate.getFullYear()
          ? latestDate.getMonth()
          : current.getMonth()
      return new Date(nextYear, nextMonth, 1)
    })
  }

  function selectDate(dateValue) {
    if (value === undefined) setInternalValue(dateValue)
    onChange?.(dateValue)
    setOpen(false)
  }

  function isOutsideRange(dateValue) {
    return Boolean((minDate && dateValue < minDate) || (maxDate && dateValue > maxDate))
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <span className="mb-2 block text-xs font-bold text-ink">
        {label}{required && <span aria-hidden="true" className="ml-1 text-error">*</span>}
      </span>
      <input
        className="pointer-events-none absolute h-px w-px opacity-0"
        type="date"
        name={name}
        value={currentValue || ''}
        required={required}
        min={minDate}
        max={maxDate}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => selectDate(event.target.value)}
        onInvalid={(event) => {
          event.preventDefault()
          setOpen(true)
          buttonRef.current?.focus()
        }}
      />
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}${required ? ', required' : ''}${selectedDate ? `, ${formatDate(currentValue)}` : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        data-date-picker
        data-required={required ? 'true' : 'false'}
        data-value={value}
        onClick={() => {
          if (!open) {
            const selected = fromDateValue(currentValue)
            setVisibleMonth(new Date((selected || new Date()).getFullYear(), (selected || new Date()).getMonth(), 1))
          }
          setOpen((current) => !current)
        }}
        className={`box-border flex w-full items-center justify-between gap-3 rounded-md border bg-white text-left text-sm shadow-sm outline-none transition focus-visible:border-forest focus-visible:ring-4 focus-visible:ring-mint ${compact ? 'h-12 px-3 py-2.5' : 'min-h-[46px] px-3.5 py-3'} ${error ? 'border-error' : 'border-line hover:border-forest'}`}
      >
        <span className={selectedDate ? 'font-medium text-ink' : 'text-muted'}>
          {selectedDate ? formatDate(currentValue) : 'Select date'}
        </span>
        <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
      </button>
      {error && <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-error">{error}</p>}

      {open && (
        <div
          role="dialog"
          aria-label={`${label} calendar`}
          className="absolute left-0 top-full z-30 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-lg border border-line bg-white p-3 shadow-[0_12px_32px_rgba(13,47,34,0.16)]"
        >
          <div className="mb-2 flex items-center justify-between gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
              disabled={visibleMonth <= new Date(firstAllowedMonth.getFullYear(), firstAllowedMonth.getMonth(), 1)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <div className="flex min-w-0 items-center gap-1.5">
              <label className="sr-only" htmlFor={`${fieldId}-month`}>Select month</label>
              <select
                id={`${fieldId}-month`}
                aria-label="Select month"
                value={visibleMonth.getMonth()}
                onChange={(event) => changeVisibleMonth(event.target.value)}
                className="min-w-0 rounded-md border border-line-soft bg-white px-2 py-1.5 text-xs font-semibold text-deep outline-none focus:border-forest focus:ring-2 focus:ring-mint-strong"
              >
                {months.map((month) => (
                  <option
                    key={month.value}
                    value={month.value}
                    disabled={isMonthOutsideRange(visibleMonth.getFullYear(), month.value)}
                  >
                    {month.label}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor={`${fieldId}-year`}>Select year</label>
              <select
                id={`${fieldId}-year`}
                aria-label="Select year"
                value={visibleMonth.getFullYear()}
                onChange={(event) => changeVisibleYear(event.target.value)}
                className="w-[5.5rem] rounded-md border border-line-soft bg-white px-2 py-1.5 text-xs font-semibold text-deep outline-none focus:border-forest focus:ring-2 focus:ring-mint-strong"
              >
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
              disabled={currentIsLatestMonth || visibleMonth >= new Date(lastAllowedMonth.getFullYear(), lastAllowedMonth.getMonth(), 1)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {weekdays.map((weekday) => (
              <span key={weekday} className="grid h-6 place-items-center text-[9px] font-semibold text-muted">
                {weekday}
              </span>
            ))}
            {days.map(({ date, value: dateValue, inMonth }) => {
              const selected = dateValue === currentValue
              const isToday = dateValue === todayValue
              const isOutsideDateRange = isOutsideRange(dateValue)
              return (
                <button
                  key={dateValue}
                  type="button"
                  aria-label={date.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  aria-pressed={selected}
                  onClick={() => selectDate(dateValue)}
                  disabled={isOutsideDateRange}
                  className={`grid h-7 place-items-center rounded-md text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:cursor-not-allowed disabled:opacity-35 ${selected ? 'bg-forest font-bold text-white hover:bg-forest-dark' : inMonth ? 'text-ink hover:bg-mint' : 'text-muted hover:bg-page'} ${isToday && !selected ? 'ring-1 ring-inset ring-mint-strong' : ''}`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between border-t border-line-soft pt-2">
            <button type="button" onClick={() => selectDate('')} className="rounded px-2 py-1 text-[10px] font-semibold text-muted hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">
              Clear date
            </button>
            <button type="button" onClick={() => !isOutsideRange(todayValue) && selectDate(todayValue)} disabled={isOutsideRange(todayValue)} className="rounded px-2 py-1 text-[10px] font-semibold text-forest hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:cursor-not-allowed disabled:opacity-40">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
