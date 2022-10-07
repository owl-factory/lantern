
export interface FormValues {
  file: File | null; // The fle to upload
  fileInput: string; // A temporary file field
  auxData: Record<string, unknown>; // Any auxilliary data
}
