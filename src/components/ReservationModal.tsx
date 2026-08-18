import { useEffect, useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitReservation, type ReservationRequest } from "@/lib/reservation-service";

type ReservationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
};

const EMPTY_FORM: FormState = { name: "", phone: "", date: "", time: "", guests: "2", message: "" };

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function ReservationModal({ open, onOpenChange }: ReservationModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Reset the form + status every time the modal is (re)opened
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setErrors({});
      setStatus("idle");
    }
  }, [open]);

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }

    const digitCount = form.phone.replace(/\D/g, "").length;
    if (!form.phone.trim() || digitCount < 7) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.date) {
      nextErrors.date = "Please select a date.";
    } else if (form.date < todayIso()) {
      nextErrors.date = "Date can't be in the past.";
    }

    if (!form.time) {
      nextErrors.time = "Please select a time.";
    }

    const guestsNum = Number(form.guests);
    if (!form.guests || !Number.isInteger(guestsNum) || guestsNum < 1) {
      nextErrors.guests = "Enter at least 1 guest.";
    } else if (guestsNum > 30) {
      nextErrors.guests = "For parties over 30, please call us directly.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return; // guard against double-submit
    if (!validate()) return;

    setStatus("submitting");
    try {
      const payload: ReservationRequest = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        message: form.message.trim() || undefined,
      };
      await submitReservation(payload);
      setStatus("success");
    } catch {
      setStatus("idle");
      setErrors({ phone: "Something went wrong — please try again or call us." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl border-border/60 bg-card max-h-[90vh] overflow-y-auto">
        {status === "success" ? (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="text-primary" size={30} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-cream">Reservation request received!</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Thank you, {form.name.trim().split(" ")[0]}. We'll contact you shortly to confirm your table.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="btn-primary hover:[background:var(--orange-glow)] hover:-translate-y-0.5 mt-6"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center mb-1">
                <CalendarCheck className="text-primary" size={20} />
              </div>
              <DialogTitle className="text-cream text-xl">Book a Table</DialogTitle>
              <DialogDescription>
                Fill in your details and we'll confirm your reservation shortly.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="mt-1 space-y-3.5">
              <div>
                <Label htmlFor="res-name" className="text-cream">Full Name</Label>
                <Input
                  id="res-name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="John Smith"
                  aria-invalid={!!errors.name}
                  className="mt-1.5 bg-secondary/40 border-border/60 text-cream placeholder:text-muted-foreground focus-visible:ring-primary/50"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="res-phone" className="text-cream">Phone Number</Label>
                <Input
                  id="res-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+1 (323) 555-0100"
                  aria-invalid={!!errors.phone}
                  className="mt-1.5 bg-secondary/40 border-border/60 text-cream placeholder:text-muted-foreground focus-visible:ring-primary/50"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="res-date" className="text-cream">Date</Label>
                  <Input
                    id="res-date"
                    type="date"
                    min={todayIso()}
                    value={form.date}
                    onChange={(e) => setField("date", e.target.value)}
                    aria-invalid={!!errors.date}
                    className="mt-1.5 bg-secondary/40 border-border/60 text-cream placeholder:text-muted-foreground focus-visible:ring-primary/50"
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
                </div>
                <div>
                  <Label htmlFor="res-time" className="text-cream">Time</Label>
                  <Input
                    id="res-time"
                    type="time"
                    value={form.time}
                    onChange={(e) => setField("time", e.target.value)}
                    aria-invalid={!!errors.time}
                    className="mt-1.5 bg-secondary/40 border-border/60 text-cream placeholder:text-muted-foreground focus-visible:ring-primary/50"
                  />
                  {errors.time && <p className="mt-1 text-xs text-red-400">{errors.time}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="res-guests" className="text-cream flex items-center gap-1.5">
                  <Users size={13} /> Number of Guests
                </Label>
                <Input
                  id="res-guests"
                  type="number"
                  min={1}
                  max={30}
                  value={form.guests}
                  onChange={(e) => setField("guests", e.target.value)}
                  aria-invalid={!!errors.guests}
                  className="mt-1.5 bg-secondary/40 border-border/60 text-cream placeholder:text-muted-foreground focus-visible:ring-primary/50"
                />
                {errors.guests && <p className="mt-1 text-xs text-red-400">{errors.guests}</p>}
              </div>

              <div>
                <Label htmlFor="res-message" className="text-cream">
                  Special Request <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="res-message"
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  placeholder="Window seat, allergies, celebration…"
                  rows={2}
                  className="mt-1.5 resize-none bg-secondary/40 border-border/60 text-cream placeholder:text-muted-foreground focus-visible:ring-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary hover:[background:var(--orange-glow)] hover:-translate-y-0.5 w-full disabled:opacity-80 disabled:pointer-events-none"
              >
                {status === "submitting" ? "Sending request…" : "Request Reservation"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
