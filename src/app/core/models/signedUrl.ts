interface SignedUrlResponse {
  signedUrl: string; // Signed URL for upload
  publicUrl: string; // Public URL after upload
}

export interface SignedUrlAPIResponse {
  status: string;
  data: SignedUrlResponse;
}
