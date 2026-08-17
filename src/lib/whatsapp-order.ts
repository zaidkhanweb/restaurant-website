import type { CartItem } from "@/lib/cart-context";

// TODO: replace with the restaurant's real WhatsApp number (with country code, no + or spaces)
export const RESTAURANT_WHATSAPP_NUMBER = "1234567890";
export const RESTAURANT_NAME = "Cafeteria America";

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function buildWhatsAppOrderUrl(items: CartItem[], subtotal: number) {
  const lines: string[] = [];
  lines.push(`Hi ${RESTAURANT_NAME}! I'd like to place an order:`);
  lines.push("");
  items.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    lines.push(`• ${item.name} x${item.quantity} — ${formatPrice(lineTotal)}`);
  });
  lines.push("");
  lines.push(`Total: ${formatPrice(subtotal)}`);

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${message}`;
}
