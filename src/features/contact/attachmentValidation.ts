export const MAX_ATTACHMENT_COUNT = 5;
export const MAX_ATTACHMENT_SIZE_MB = 10;
export const MAX_ATTACHMENT_SIZE_BYTES = MAX_ATTACHMENT_SIZE_MB * 1024 * 1024;

export type AttachmentValidationResult =
  | { isValid: true }
  | { isValid: false; reason: "too_many_files"; maxCount: number }
  | { isValid: false; reason: "file_too_large"; fileName: string; maxSizeMb: number };

/**
 * Validates attachment count and size before upload.
 *
 * @param files - Candidate files selected by the user.
 * @returns Validation result describing whether the selection is accepted.
 */
export function validateAttachments(files: File[]): AttachmentValidationResult {
  if (files.length > MAX_ATTACHMENT_COUNT) {
    return {
      isValid: false,
      reason: "too_many_files",
      maxCount: MAX_ATTACHMENT_COUNT,
    };
  }

  const oversizedFile = files.find((file) => file.size > MAX_ATTACHMENT_SIZE_BYTES);
  if (oversizedFile) {
    return {
      isValid: false,
      reason: "file_too_large",
      fileName: oversizedFile.name,
      maxSizeMb: MAX_ATTACHMENT_SIZE_MB,
    };
  }

  return { isValid: true };
}
