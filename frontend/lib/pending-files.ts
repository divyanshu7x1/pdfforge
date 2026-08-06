/**
 * In-memory handoff for files selected on the landing page hero
 * before navigating to a tool route. Avoids persisting blobs to storage.
 */
let pending: File[] = []

export function setPendingFiles(files: File[]) {
  pending = files
}

export function consumePendingFiles(): File[] {
  const files = pending
  pending = []
  return files
}
