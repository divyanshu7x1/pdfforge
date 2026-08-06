import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merge PDF',
  description:
    'Combine multiple PDF files into one document in seconds. Reorder pages and download—all in your browser.',
}

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
