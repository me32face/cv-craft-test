"use client";

import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

// 🔹 Loading Spinner Component
export function Loading1() {
  return (
    <div className="flex items-center justify-center h-64">
      <ClipLoader color="#19A684" size={50} />
    </div>
  );
}

// 🔹 Warning Confirmation Modal
export async function Confirm1({
  title = "Are you sure?",
  message = "You won’t be able to revert this!",
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmColor = "#d33", // red
} = {}) {
  if (typeof window === "undefined") return false; // prevent SSR errors

  const result = await Swal.fire({
    title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#3085d6",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
}

// 🔹 Success Confirmation Modal
export async function ConfirmSuccess({
  title = "Success Action",
  message = "Do you want to continue?",
  confirmText = "Yes",
  cancelText = "No",
  confirmColor = "#28a745", // green
} = {}) {
  if (typeof window === "undefined") return false; // prevent SSR errors

  const result = await Swal.fire({
    title,
    text: message,
    icon: "success",
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;
}
