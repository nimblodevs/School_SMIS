import { CircleAlert } from 'lucide-react'

export function FormMessage({ message }) {
    if (!message) return null
    return (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-error-border bg-error-soft px-4 py-3 text-sm text-error">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
        </div>
    )
}