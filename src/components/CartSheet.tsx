import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppOrderUrl, formatPrice } from "@/lib/whatsapp-order";

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleOrder = () => {
    if (items.length === 0 || isPlacingOrder) return;
    setIsPlacingOrder(true);
    const url = buildWhatsAppOrderUrl(items, subtotal);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setIsPlacingOrder(false), 800);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-background border-border/60 flex flex-col p-0 gap-0"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/60 text-left">
          <SheetTitle className="text-cream flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            Your Order
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is empty" : `${items.length} item${items.length > 1 ? "s" : ""} in cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag size={36} className="text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground max-w-[220px]">
                Add a dish from the menu to start your order.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={72}
                    height={72}
                    className="h-16 w-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-cream truncate">{item.name}</h4>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{formatPrice(item.price)} each</div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-border/60 px-1.5 py-1">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 rounded-full flex items-center justify-center text-cream hover:bg-secondary transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-xs font-semibold text-cream tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 rounded-full flex items-center justify-center text-cream hover:bg-secondary transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 p-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-cream">
              <span>Total</span>
              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              disabled={isPlacingOrder}
              className="btn-primary hover:[background:var(--orange-glow)] hover:-translate-y-0.5 w-full disabled:opacity-80 disabled:pointer-events-none"
            >
              {isPlacingOrder ? "Opening WhatsApp…" : "Order via WhatsApp"}
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-center text-xs text-muted-foreground hover:text-cream transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
