import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlans, createOrder, verifyPayment, getSubscription } from "../services/api";
import { useAuthStore } from "../store/authStore";

const BASE_PLANS = ["pro", "premium"];

const PLAN_ICONS = {
  pro:     "⚡",
  premium: "🏆",
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const s = document.createElement("script");
    s.id  = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function Pricing() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();

  const [plans,        setPlans]        = useState({});
  const [subscription, setSubscription] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [paying,       setPaying]       = useState(null);
  const [error,        setError]        = useState("");
  const [billing,      setBilling]      = useState("monthly"); // "monthly" | "annual"

  useEffect(() => {
    Promise.all([getPlans(), getSubscription()])
      .then(([plansRes, subRes]) => {
        setPlans(plansRes.data.data);
        setSubscription(subRes.data.data);
      })
      .catch(() => setError("Could not load pricing. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planKey) => {
    setError("");
    setPaying(planKey);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay failed to load. Check your internet connection.");

      const { data } = await createOrder(planKey);
      const { orderId, amount, currency, keyId, planName } = data.data;
      const isAnnual = planKey.endsWith("_annual");

      const options = {
        key:         keyId,
        amount,
        currency,
        name:        "Stellar",
        description: `${planName} — ${isAnnual ? "12 months" : "30 days"}`,
        order_id:    orderId,
        prefill: {
          name:  user?.name  || "",
          email: user?.email || "",
        },
        theme: { color: "#007AFF" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planKey,
            });
            const subRes = await getSubscription();
            setSubscription(subRes.data.data);
            navigate("/settings");
          } catch {
            setError("Payment verification failed. Contact support if amount was deducted.");
          } finally {
            setPaying(null);
          }
        },
        modal: { ondismiss: () => setPaying(null) },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Payment failed. Try again.");
      setPaying(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  const currentPlan = subscription?.plan || "free";
  const isActive    = subscription?.isActive;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">
          Upgrade your learning
        </h1>
        <p className="text-[14px] text-apple-gray">
          Unlock AI-powered explanations, all 5 subjects, and unlimited practice.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="flex bg-apple-gray6 border border-apple-gray5 rounded-full p-1 gap-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
              billing === "monthly"
                ? "bg-white shadow text-[var(--label)]"
                : "text-apple-gray hover:text-[var(--label)]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
              billing === "annual"
                ? "bg-white shadow text-[var(--label)]"
                : "text-apple-gray hover:text-[var(--label)]"
            }`}
          >
            Annual
            <span className="text-[10px] font-bold bg-apple-green text-white px-1.5 py-0.5 rounded-full">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Current plan badge */}
      {currentPlan !== "free" && isActive && (
        <div className="card p-4 flex items-center gap-3 border-apple-green/30 bg-apple-green/5">
          <span className="text-apple-green text-lg">✅</span>
          <div>
            <p className="text-[13px] font-semibold text-apple-green">
              You're on the {plans[currentPlan]?.name || currentPlan} plan
            </p>
            <p className="text-[12px] text-apple-gray">
              Expires {new Date(subscription.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg">
          {error}
        </div>
      )}

      {/* Free plan */}
      <div className="card p-6 border border-apple-gray4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider mb-1">Free</p>
            <p className="text-[28px] font-bold text-[var(--label)]">₹0</p>
            <p className="text-[12px] text-apple-gray">Always free</p>
          </div>
          {currentPlan === "free" && (
            <span className="text-[11px] font-semibold bg-apple-gray5 text-apple-gray px-3 py-1 rounded-full">
              Current plan
            </span>
          )}
        </div>
        <ul className="mt-4 space-y-2">
          {["10 AI explanations/day", "Math subject only", "Basic practice questions", "Study planner"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-[13px] text-apple-gray">
              <span className="text-apple-gray3">○</span> {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Paid plans */}
      <div className="grid md:grid-cols-2 gap-4">
        {BASE_PLANS.map((base) => {
          const planKey   = billing === "annual" ? `${base}_annual` : base;
          const plan      = plans[planKey];
          const monthly   = plans[base]; // always the monthly plan for features list
          if (!plan || !monthly) return null;

          const isPremium    = base === "premium";
          const isAnnual     = billing === "annual";
          const isCurrent    = currentPlan === planKey && isActive;
          // If on monthly but viewing annual tab, or vice versa — show a softer note
          const isOtherBilling = isActive && (
            (isAnnual  && currentPlan === base) ||
            (!isAnnual && currentPlan === `${base}_annual`)
          );
          const isPaying     = paying === planKey;

          // Pricing display
          const totalPrice   = plan.price / 100;                          // e.g. 1799 or 199
          const perMonth     = isAnnual ? Math.round(totalPrice / 12) : totalPrice;
          const monthlyFull  = monthly.price / 100;                       // e.g. 199
          const annualSaving = isAnnual
            ? Math.round(monthlyFull * 12 - totalPrice)
            : null;

          return (
            <div
              key={planKey}
              className={`card p-6 relative ${
                isPremium
                  ? "border-2 border-apple-blue shadow-lg"
                  : "border border-apple-gray4"
              }`}
            >
              {isPremium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-apple-blue text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              {isAnnual && plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="bg-apple-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-wider mb-1">
                    {PLAN_ICONS[base]} {monthly.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <p className="text-[32px] font-bold text-[var(--label)] leading-none">₹{perMonth}</p>
                    <p className="text-[14px] text-apple-gray mb-0.5">/mo</p>
                  </div>
                  {isAnnual ? (
                    <div className="space-y-0.5 mt-1">
                      <p className="text-[12px] text-apple-gray">₹{totalPrice.toLocaleString("en-IN")} billed yearly</p>
                      <p className="text-[11px] text-apple-green font-semibold">Save ₹{annualSaving} vs monthly</p>
                    </div>
                  ) : (
                    <p className="text-[12px] text-apple-gray mt-1">billed monthly</p>
                  )}
                </div>
                {isCurrent && (
                  <span className="text-[11px] font-semibold bg-apple-green/10 text-apple-green px-3 py-1 rounded-full">
                    Active
                  </span>
                )}
                {isOtherBilling && (
                  <span className="text-[11px] font-semibold bg-apple-blue/10 text-apple-blue px-2 py-1 rounded-full">
                    {isAnnual ? "On monthly" : "On annual"}
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {(isAnnual ? plan.features : monthly.features).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--label)]">
                    <span className="text-apple-green mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-apple font-semibold text-[14px] transition-[background-color,border-color,opacity,transform] active:scale-[0.97] ${
                  isCurrent
                    ? "bg-apple-gray5 text-apple-gray cursor-default"
                    : isPremium
                    ? "btn-primary"
                    : "bg-apple-gray6 border border-apple-gray4 text-[var(--label)] hover:bg-apple-gray5"
                }`}
                disabled={isCurrent || isPaying}
                onClick={() => !isCurrent && handleUpgrade(planKey)}
              >
                {isPaying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Processing…
                  </span>
                ) : isCurrent ? "Current plan" : `Upgrade to ${monthly.name}${isAnnual ? " Annual" : ""}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-center text-[12px] text-apple-gray">
        All payments are secure and processed by Razorpay.
        {" "}Annual plans are billed once per year. GST may be applicable. For support, contact us.
      </p>
    </div>
  );
}
