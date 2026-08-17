import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/cart-context";
import { formatPrice } from "@/lib/whatsapp-order";

type ProductModalProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product, quantity: number) => void;
};

export function ProductModal({ product, open, onOpenChange, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Reset the quantity + "added" state whenever a new product is opened
  useEffect(() => {
    if (open) {
      setQuantity(1);
      setJustAdded(false);
    }
  }, [open, product?.id]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    window.setTimeout(() => onOpenChange(false), 650);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] sm:w-full max-h-[calc(100vh-1.5rem)] rounded-2xl border-border/60 bg-card p-0 overflow-hidden gap-0">
        <div className="relative h-[clamp(175px,30vh,240px)] w-full shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            width={800}
            height={600}
          />
        </div>

        <div className="p-5 sm:p-6 overflow-hidden">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-xl font-bold text-cream">{product.name}</DialogTitle>
            {product.rating && (
              <div className="flex items-center gap-2 text-sm pt-1">
                <div className="flex text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                {product.reviews && (
                  <span className="text-muted-foreground text-xs">({product.reviews} reviews)</span>
                )}
              </div>
            )}
            <DialogDescription className="text-primary font-bold text-lg pt-1">
              {formatPrice(product.price)}
            </DialogDescription>
          </DialogHeader>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mt-3">
              <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-cream">
                Ingredients
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-[0.7rem] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/60"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-cream">
              Quantity
            </span>
            <div className="flex items-center gap-4 rounded-full border border-border/60 px-2 py-1.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-7 w-7 rounded-full flex items-center justify-center text-cream hover:bg-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-semibold text-cream tabular-nums">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="h-7 w-7 rounded-full flex items-center justify-center text-cream hover:bg-secondary transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={justAdded}
            className="btn-primary hover:[background:var(--orange-glow)] hover:-translate-y-0.5 w-full mt-4 py-3.5 disabled:pointer-events-none disabled:opacity-90"
          >
            {justAdded ? (
              "Added to Cart ✓"
            ) : (
              <>
                <ShoppingBag size={14} />
                Add to Cart — {formatPrice(product.price * quantity)}
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
