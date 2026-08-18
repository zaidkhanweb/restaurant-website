import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Leaf, ChefHat, Utensils, Clock, MapPin, Phone, Truck, Star, ArrowRight, Instagram, Facebook, Twitter, ShoppingBag } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import interiorImg from "@/assets/interior.jpg";
import { CartProvider, useCart, type Product } from "@/lib/cart-context";
import { ProductModal } from "@/components/ProductModal";
import { CartSheet } from "@/components/CartSheet";
import { ReservationModal } from "@/components/ReservationModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cafeteria America — Modern American Kitchen & Bar" },
      {
        name: "description",
        content:
          "Cafeteria America is a modern American restaurant serving elevated classics, craft cocktails and unforgettable evenings in Los Angeles.",
      },
      { property: "og:title", content: "Cafeteria America — Modern American Kitchen & Bar" },
      { property: "og:description", content: "Cafeteria America is a modern American restaurant serving elevated classics, craft cocktails and unforgettable evenings in Los Angeles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}

function HomeContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const { addItem } = useCart();

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Nav onCartClick={() => setIsCartOpen(true)} onReserveClick={() => setIsReservationOpen(true)} />
      <Hero onReserveClick={() => setIsReservationOpen(true)} />
      <Features />
      <Specials onSelectProduct={handleSelectProduct} />
      <About />
      <ContactBar />
      <Footer />

      <ProductModal
        product={selectedProduct}
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        onAddToCart={addItem}
      />
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <ReservationModal open={isReservationOpen} onOpenChange={setIsReservationOpen} />
    </main>
  );
}

function Nav({ onCartClick, onReserveClick }: { onCartClick: () => void; onReserveClick: () => void }) {
  const { totalItems } = useCart();
  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 h-24 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <ChefHat className="text-primary" size={28} />
          <div className="leading-none">
            <div className="script text-3xl text-cream">Cafeteria</div>
            <div className="text-[0.6rem] tracking-[0.4em] text-primary mt-1">AMERICA</div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-9 text-sm font-medium">
          {[
            { label: "Home", href: "#top", active: true },
            { label: "Menu", href: "#menu" },
            { label: "About Us", href: "#about" },
            { label: "Gallery", href: "#menu" },
            { label: "Contact", href: "#contact" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`relative transition-colors ${l.active ? "text-primary" : "text-cream hover:text-primary"}`}
            >
              {l.label}
              {l.active && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-5 bg-primary" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCartClick}
            aria-label="Open cart"
            className="relative h-11 w-11 rounded-full border border-cream/30 flex items-center justify-center text-cream hover:border-primary hover:text-primary transition-colors"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[0.65rem] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onReserveClick}
            className="hidden sm:inline-flex btn-primary hover:[background:var(--orange-glow)] hover:-translate-y-0.5"
          >
            Book a Table
          </button>
        </div>
      </div>
    </header>
  );
}

function DividerDashes() {
  return (
    <span className="inline-flex items-center gap-2 text-primary">
      <span className="h-px w-8 bg-primary" />
      <Heart size={12} fill="currentColor" />
      <span className="h-px w-8 bg-primary" />
    </span>
  );
}

function Hero({ onReserveClick }: { onReserveClick: () => void }) {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Signature dish" width={1600} height={1200} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-7rem)]">
        <div>
          <h1 className="script text-6xl sm:text-7xl text-cream leading-none">Good Food</h1>
          <h2 className="mt-3 text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.95]">
            <span className="text-cream">GOOD </span>
            <span className="text-primary">MOOD</span>
          </h2>
          <div className="mt-6"><DividerDashes /></div>
          <p className="mt-6 max-w-md text-muted-foreground text-base leading-relaxed">
            Delicious meals made with fresh ingredients, served with love in the heart of Los Angeles.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#menu" className="btn-primary hover:[background:var(--orange-glow)] hover:-translate-y-0.5">
              View Menu <ArrowRight size={14} />
            </a>
            <button type="button" onClick={onReserveClick} className="btn-ghost hover:bg-cream hover:text-background">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Leaf, title: "Fresh Ingredients", desc: "We use only the freshest & finest ingredients." },
    { icon: ChefHat, title: "Expert Chefs", desc: "Our chefs craft every dish with passion and expertise." },
    { icon: Utensils, title: "Quality Service", desc: "Fast, friendly & professional service every time." },
    { icon: Heart, title: "Made With Love", desc: "Every dish is made with love to delight your taste buds." },
  ];
  return (
    <section className="relative -mt-16 px-6 z-10">
      <div className="mx-auto max-w-6xl bg-cream text-background rounded-2xl shadow-2xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-black/10">
        {items.map((it) => (
          <div key={it.title} className="p-8 text-center flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center">
              <it.icon className="text-primary" size={22} />
            </div>
            <h3 className="mt-5 text-xs font-bold tracking-[0.22em] uppercase">{it.title}</h3>
            <p className="mt-3 text-sm text-background/70 max-w-[180px] leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const DISHES: Product[] = [
  {
    id: "america-burger",
    image: dish2,
    name: "The America Burger",
    rating: 4.9,
    reviews: 132,
    price: 18.0,
    description:
      "A juicy grilled beef patty stacked with melted cheddar, crisp lettuce, tomato and our signature house sauce, served on a toasted brioche bun.",
    ingredients: ["Beef Patty", "Cheddar", "Brioche Bun", "House Sauce", "Lettuce", "Tomato"],
  },
  {
    id: "braised-short-rib",
    image: dish3,
    name: "Braised Short Rib",
    rating: 4.8,
    reviews: 98,
    price: 34.0,
    description:
      "Slow-braised for eight hours until fork-tender, served over creamy mashed potatoes with roasted root vegetables and a rich red wine jus.",
    ingredients: ["Beef Short Rib", "Mashed Potatoes", "Root Vegetables", "Red Wine Jus"],
  },
  {
    id: "sunday-brunch-stack",
    image: dish1,
    name: "Sunday Brunch Stack",
    rating: 4.9,
    reviews: 110,
    price: 16.0,
    description:
      "Fluffy buttermilk pancakes layered with fresh seasonal berries, whipped cream and warm maple syrup — the weekend favorite.",
    ingredients: ["Buttermilk Pancakes", "Seasonal Berries", "Whipped Cream", "Maple Syrup"],
  },
];

function Specials({ onSelectProduct }: { onSelectProduct: (product: Product) => void }) {
  return (
    <section id="menu" className="py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-xl mx-auto">
          <div className="eyebrow">— Popular Dishes —</div>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold">Our Chef's Specials</h2>
          <div className="mt-4 flex justify-center"><DividerDashes /></div>
          <p className="mt-4 text-sm text-muted-foreground">Tap any dish to view details and add it to your order.</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {DISHES.map((d) => (
            <article
              key={d.id}
              onClick={() => onSelectProduct(d)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectProduct(d);
                }
              }}
              className="bg-card rounded-2xl overflow-hidden group border border-border/60 cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  aria-label="Favorite"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:scale-110 transition"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <div className="flex text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-xs">({d.reviews})</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">${d.price.toFixed(2)}</span>
                  <span className="text-[0.65rem] tracking-[0.15em] uppercase font-semibold text-cream/70 group-hover:text-primary transition-colors">
                    View &amp; Order
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-16 px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img
            src={interiorImg}
            alt="Cafeteria America dining room"
            loading="lazy"
            width={1600}
            height={1000}
            className="w-full h-[440px] object-cover rounded-2xl"
          />
          <div className="absolute bottom-6 left-6 bg-primary text-primary-foreground rounded-xl px-6 py-5 text-center shadow-2xl">
            <div className="text-4xl font-black leading-none">10+</div>
            <div className="mt-1 text-[0.65rem] tracking-[0.2em] uppercase font-semibold">Years of<br />Experience</div>
          </div>
        </div>

        <div>
          <div className="eyebrow">About Us</div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
            A Place Where<br />Good Food &amp; Good Times<br />Come Together
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
            At <span className="text-primary font-medium">Cafeteria America</span>, we believe that every meal
            is an experience. From our cozy ambiance to our delicious dishes, we're here to make your
            moments memorable.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <a href="#menu" className="btn-primary hover:[background:var(--orange-glow)] hover:-translate-y-0.5">
              Learn More <ArrowRight size={14} />
            </a>
            <span className="script text-3xl text-primary">Cafeteria <Heart className="inline" size={18} fill="currentColor" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBar() {
  const items = [
    { icon: MapPin, label: "Our Location", lines: ["South Los Angeles,", "California, USA"] },
    { icon: Clock, label: "Opening Hours", lines: ["Mon – Sun", "10:00 AM – 11:00 PM"] },
    { icon: Phone, label: "Call Us", lines: ["+1 (323) 555-0100", "+1 (323) 555-0101"] },
    { icon: Truck, label: "Fast Delivery", lines: ["Delicious food", "delivered fast to you."] },
  ];
  return (
    <section id="contact" className="px-6 pb-16 mt-12">
      <div className="mx-auto max-w-7xl bg-primary text-primary-foreground rounded-2xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-primary-foreground/15 shadow-2xl">
        {items.map((it) => (
          <div key={it.label} className="p-6 flex items-start gap-4">
            <div className="h-11 w-11 shrink-0 rounded-full bg-background flex items-center justify-center">
              <it.icon className="text-primary" size={18} />
            </div>
            <div>
              <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold">{it.label}</div>
              <div className="mt-2 text-sm leading-relaxed">
                {it.lines.map((l) => <div key={l}>{l}</div>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Cafeteria America. All Rights Reserved.</p>
        <div className="flex gap-3">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <a key={i} href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
