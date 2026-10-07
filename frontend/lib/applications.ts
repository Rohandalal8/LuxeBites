import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export type ApplicationState = "PENDING" | "APPROVED" | "REJECTED";
export type PlatformRole = "CUSTOMER" | "RESTAURANT_OWNER" | "RIDER" | "ADMIN";

export type ApplicationSummary = {
  id: string;
  status: ApplicationState;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type ApplicationStatus = {
  role: PlatformRole;
  roles: PlatformRole[];
  ownerApplication: ApplicationSummary | null;
  riderApplication: ApplicationSummary | null;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function fetchApplicationStatus(): Promise<ApplicationStatus> {
  if (!auth?.currentUser) {
    throw new Error("Please sign in to check your partner status.");
  }

  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${apiUrl}/applications/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = (await response.json().catch(() => null)) as { data?: ApplicationStatus; message?: string } | null;

  if (!response.ok || !payload?.data) {
    throw new Error(payload?.message ?? "Unable to check your partner status.");
  }

  return payload.data;
}

export async function submitApplication(type: "owner" | "rider", data: Record<string, unknown>) {
  if (!auth?.currentUser) throw new Error("Your session has expired. Please sign in again.");
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${apiUrl}/applications/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const payload = (await response.json().catch(() => null)) as { data?: ApplicationSummary; message?: string } | null;
  if (!response.ok) throw new Error(payload?.message ?? "Your application could not be submitted.");
  return payload?.data;
}

export function uploadApplicationFile(file: File, applicationType: "owner" | "rider", documentType: string, onProgress?: (progress: number) => void) {
  if (!auth?.currentUser || !storage) throw new Error("Secure document storage is not configured.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Each document must be smaller than 10 MB.");
  if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Documents must be PDF, JPG, PNG, or WEBP files.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const upload = uploadBytesResumable(ref(storage, `applications/${auth.currentUser.uid}/${applicationType}/${documentType}-${Date.now()}-${safeName}`), file, { contentType: file.type });
  return new Promise<string>((resolve, reject) => {
    upload.on("state_changed", (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)), (error) => reject(new Error(`Document upload failed: ${error.message}`)), async () => resolve(await getDownloadURL(upload.snapshot.ref)));
  });
}
