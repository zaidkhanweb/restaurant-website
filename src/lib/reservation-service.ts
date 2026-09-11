export type ReservationRequest = {
  name: string;
  phone: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  guests: number;
  message?: string;
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xljeabwj";

/**
 * Clean abstraction point for the reservation form's submission.
 * Currently sends to Formspree — the UI never needs to change, it only
 * cares whether this resolves or throws.
 */
export async function submitReservation(data: ReservationRequest): Promise<{ ok: true }> {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      message: data.message,
    }),
  });

  if (!response.ok) throw new Error("Failed to submit reservation");

  return { ok: true };
}
