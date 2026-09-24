export type ReservationRequest = {
  name: string;
  phone: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  guests: number;
  message?: string;
};

const N8N_RESERVATION_WEBHOOK = "https://steering-stranger-oops-reviewer.trycloudflare.com/webhook/restaurant-reservation";

/**
 * Clean abstraction point for the reservation form's submission.
 * Sends reservation requests to the n8n webhook. The UI never needs to change;
 * it only cares whether this resolves or throws.
 */
export async function submitReservation(data: ReservationRequest): Promise<{ ok: true }> {
  const response = await fetch(N8N_RESERVATION_WEBHOOK, {
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
