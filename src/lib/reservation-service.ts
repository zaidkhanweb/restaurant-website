export type ReservationRequest = {
  name: string;
  phone: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  guests: number;
  message?: string;
};

// TODO: Replace with the client's real reservation inbox (or swap this whole
// file for a real form service like Formspree) before going live.
export const RESERVATION_EMAIL = "REPLACE_WITH_CLIENT_EMAIL";

/**
 * Clean abstraction point for the reservation form's submission.
 * Swap the body of this function to call a real email/form service
 * (Formspree, a serverless function, a booking API, etc.) — the UI
 * never needs to change, it only cares whether this resolves or throws.
 *
 * Example once a real destination is ready:
 *
 *   const response = await fetch("https://formspree.io/f/your-form-id", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ ...data, to: RESERVATION_EMAIL }),
 *   });
 *   if (!response.ok) throw new Error("Failed to submit reservation");
 */
export async function submitReservation(data: ReservationRequest): Promise<{ ok: true }> {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info(
      "[Reservation] Form is wired and validated. Connect RESERVATION_EMAIL or a real form service in reservation-service.ts to actually deliver this:",
      data,
    );
  }

  // Simulated request so the submitting/success UI behaves exactly like it
  // will once a real service is connected above.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return { ok: true };
}
