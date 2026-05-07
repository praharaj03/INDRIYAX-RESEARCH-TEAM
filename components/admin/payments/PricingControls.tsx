"use client";
import { useState } from "react";
import { RiSaveLine, RiCheckLine, RiFlashlightLine, RiVipCrownLine, RiCouponLine, RiAddLine } from "react-icons/ri";

const defaultPricing = {
  pro_monthly: "199",
  elite_annual: "1499",
};

const defaultDiscounts = [
  { code: "STUDENT50", type: "percent", value: "50", plan: "pro", note: "Student discount" },
  { code: "WELCOME20", type: "percent", value: "20", plan: "all", note: "New user welcome" },
];

export default function PricingControls() {
  const [pricing, setPricing] = useState(defaultPricing);
  const [discounts, setDiscounts] = useState(defaultDiscounts);
  const [saved, setSaved] = useState(false);
  const [newCode, setNewCode] = useState({ code: "", type: "percent", value: "", plan: "all", note: "" });
  const [showAdd, setShowAdd] = useState(false);

  function handleSavePricing() {
    // TODO (Backend Dev): PATCH /api/admin/payments/pricing with { pro_monthly, elite_annual }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleAddDiscount() {
    if (!newCode.code || !newCode.value) return;
    setDiscounts((prev) => [...prev, newCode]);
    setNewCode({ code: "", type: "percent", value: "", plan: "all", note: "" });
    setShowAdd(false);
    // TODO (Backend Dev): POST /api/admin/payments/discounts with newCode
  }

  function handleRemoveDiscount(code: string) {
    setDiscounts((prev) => prev.filter((d) => d.code !== code));
    // TODO (Backend Dev): DELETE /api/admin/payments/discounts/:code
  }

  const inputCls = "bg-dark-4 border border-border text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all w-full placeholder:text-gray-700";
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <div className="flex flex-col gap-4">

      {/* Plan pricing */}
      <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <p className="text-white font-semibold text-sm">Plan Pricing</p>
          <span className="text-xs text-gray-600 bg-dark-4 border border-border px-2.5 py-1 rounded-lg">
            Backend required to persist
          </span>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Pro */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <RiFlashlightLine size={15} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Pro — Monthly</p>
              <p className="text-gray-600 text-xs">30-day access to all restricted events</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-gray-500 text-sm">₹</span>
              <input
                type="number" min="0"
                value={pricing.pro_monthly}
                onChange={(e) => setPricing({ ...pricing, pro_monthly: e.target.value })}
                className="w-24 bg-dark-4 border border-border text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-right"
              />
              <span className="text-gray-600 text-xs">/mo</span>
            </div>
          </div>

          {/* Elite */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <RiVipCrownLine size={15} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Elite — Annual</p>
              <p className="text-gray-600 text-xs">365-day full access + exclusive perks</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-gray-500 text-sm">₹</span>
              <input
                type="number" min="0"
                value={pricing.elite_annual}
                onChange={(e) => setPricing({ ...pricing, elite_annual: e.target.value })}
                className="w-24 bg-dark-4 border border-border text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-right"
              />
              <span className="text-gray-600 text-xs">/yr</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-border">
            <p className="text-gray-600 text-xs">Changes will reflect on the /subscribe page after backend is wired</p>
            <button
              onClick={handleSavePricing}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-dark hover:bg-primary/90 transition-colors"
            >
              {saved ? <><RiCheckLine size={13} /> Saved</> : <><RiSaveLine size={13} /> Save Pricing</>}
            </button>
          </div>
        </div>
      </div>

      {/* Discount codes */}
      <div className="bg-dark-3 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiCouponLine size={15} className="text-gray-500" />
            <p className="text-white font-semibold text-sm">Discount Codes</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <RiAddLine size={13} /> Add Code
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="px-5 py-4 border-b border-border bg-dark-4/40 grid grid-cols-2 gap-3">
            <input placeholder="Code e.g. SAVE30" value={newCode.code}
              onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
              className={inputCls} />
            <input placeholder="Note e.g. Student discount" value={newCode.note}
              onChange={(e) => setNewCode({ ...newCode, note: e.target.value })}
              className={inputCls} />
            <div className="flex gap-2">
              <select value={newCode.type} onChange={(e) => setNewCode({ ...newCode, type: e.target.value })} className={selectCls}>
                <option value="percent">% Off</option>
                <option value="flat">₹ Flat</option>
              </select>
              <input type="number" min="0" placeholder="Value" value={newCode.value}
                onChange={(e) => setNewCode({ ...newCode, value: e.target.value })}
                className={inputCls} />
            </div>
            <select value={newCode.plan} onChange={(e) => setNewCode({ ...newCode, plan: e.target.value })} className={selectCls}>
              <option value="all">All Plans</option>
              <option value="pro">Pro Only</option>
              <option value="elite">Elite Only</option>
            </select>
            <div className="col-span-2 flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="text-xs text-gray-500 hover:text-white px-3 py-2 rounded-lg border border-border transition-colors">Cancel</button>
              <button onClick={handleAddDiscount} className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-dark hover:bg-primary/90 transition-colors">Add</button>
            </div>
          </div>
        )}

        <div className="divide-y divide-border">
          {discounts.map((d) => (
            <div key={d.code} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <RiCouponLine size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-white text-sm font-bold tracking-wide">{d.code}</code>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    {d.type === "percent" ? `${d.value}% off` : `₹${d.value} off`}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-border">
                    {d.plan === "all" ? "All plans" : d.plan.charAt(0).toUpperCase() + d.plan.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-0.5">{d.note}</p>
              </div>
              <button
                onClick={() => handleRemoveDiscount(d.code)}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
