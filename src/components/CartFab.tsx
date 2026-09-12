import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type CartFabProps = {
  onClick: () => void;
};

/**
 * Floating cart button — stays fixed on screen while scrolling so the cart
 * (and item count) is always reachable, even once the header/navbar has
 * scrolled out of view. Reuses the existing cart state; does not introduce
 * a second cart system.
 */
export function CartFab({ onClick }: CartFabProps) {
  const { totalItems } = useCart();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={totalItems > 0 ? `Open cart, ${totalItems} items` : "Open cart"}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:[background:var(--orange-glow)] hover:-translate-y-0.5 transition-all"
    >
      <ShoppingBag size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 h-6 min-w-6 px-1.5 rounded-full bg-cream text-background text-xs font-bold flex items-center justify-center border-2 border-background">
          {totalItems}
        </span>
      )}
    </button>
  );
}
