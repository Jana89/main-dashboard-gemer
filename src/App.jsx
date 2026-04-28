import React, { useMemo, useState } from "react";

const navItems = [
  "Triage",
  "Cases",
  "Orders",
  "Substitutions",
  "Refunds",
  "Deliveries",
  "Campaigns",
  "Analytics",
  "Customers",
  "Pricing Insights",
  "Settings",
];

const triageCards = [
  { label: "Overdue orders", value: "18", helper: "Need review before customer follow-up" },
  { label: "Waiting on stock", value: "26", helper: "Main source of manual support work" },
  { label: "Refunds pending", value: "9", helper: "Awaiting accounting or action" },
  { label: "Courier exceptions", value: "6", helper: "Delivery problems needing contact" },
];

const cases = [
  { id: "CS-2011", customer: "Laura M.", type: "Out of stock", priority: "High", order: "#100481", next: "Offer substitute", note: "Warehouse missing 1 SKU; customer still inside promised window." },
  { id: "CS-2008", customer: "Emma L.", type: "Refund pending", priority: "High", order: "#100355", next: "Confirm refund", note: "Picking completed; payment return still not pushed through." },
  { id: "CS-2003", customer: "Kadi T.", type: "Gift campaign issue", priority: "Medium", order: "#100433", next: "Send gift recovery message", note: "Order qualified, gift SKU unavailable." },
  { id: "CS-1998", customer: "Anna V.", type: "Courier exception", priority: "Medium", order: "#100390", next: "Contact courier", note: "Phone number mismatch likely blocking delivery." },
];

const orders = [
  { id: "#100481", customer: "Laura M.", reason: "Waiting on stock", status: "Needs action", stock: "Store stock exists in Tartu", courier: "Not dispatched", refund: "None" },
  { id: "#100355", customer: "Emma L.", reason: "Refund pending", status: "Blocked", stock: "Received return", courier: "Returned", refund: "Awaiting accounting" },
  { id: "#100433", customer: "Kadi T.", reason: "Gift mismatch", status: "Needs action", stock: "Gift unavailable", courier: "Packed", refund: "None" },
  { id: "#100390", customer: "Anna V.", reason: "Courier exception", status: "Follow-up", stock: "In warehouse", courier: "Address issue", refund: "None" },
];

const substitutionSuggestions = [
  { missing: "Hydrating Serum 30ml", suggestion: "Hydrating Serum 50ml", logic: "Same brand, same effect, next closest price band", channel: "SMS works best" },
  { missing: "Repair Mask Mini", suggestion: "Repair Mask Standard", logic: "Same brand, stronger value, price difference absorbable", channel: "Email + fallback phone" },
  { missing: "Gift Set Rose", suggestion: "Voucher + alternate gift", logic: "Campaign recovery when gift SKU unavailable", channel: "Email" },
];

const refunds = [
  { id: "RF-771", order: "#100355", customer: "Emma L.", stage: "Pending accounting", amount: "€39.50", blocker: "Needs synced confirmation across systems" },
  { id: "RF-768", order: "#100322", customer: "Helen S.", stage: "Pre-filled", amount: "€14.90", blocker: "Agent review required" },
  { id: "RF-764", order: "#100301", customer: "Mari P.", stage: "Customer confirmed", amount: "€22.00", blocker: "Awaiting end-of-day batch" },
];

const deliveries = [
  { order: "#100390", issue: "Phone number invalid", courier: "Omniva", next: "Request corrected number" },
  { order: "#100287", issue: "Parcel exception", courier: "DPD", next: "Proactive apology + tracking update" },
  { order: "#100240", issue: "Address mismatch", courier: "Itella", next: "Agent follow-up needed" },
];

const campaigns = [
  { name: "Gift over €25", state: "Live", risk: "Gift SKU low stock", affected: "12 open orders" },
  { name: "Free shipping threshold", state: "Live", risk: "No issue", affected: "—" },
  { name: "Weekend bundle", state: "Ends today", risk: "Bundle stock mismatch", affected: "4 open orders" },
];

const analytics = [
  { name: "Stock issues", pct: 78 },
  { name: "Refunds", pct: 9 },
  { name: "Courier issues", pct: 7 },
  { name: "Gift / campaign", pct: 4 },
  { name: "Warranty / product", pct: 2 },
];

const customers = [
  { name: "Laura M.", value: "VIP", history: "3 prior cases", channel: "SMS", guidance: "Quick substitute + goodwill works well" },
  { name: "Emma L.", value: "Medium", history: "2 refund cases", channel: "Email", guidance: "Keep refund updates frequent" },
  { name: "Kadi T.", value: "High", history: "No refund history", channel: "Email", guidance: "Campaign recovery likely enough" },
];

const pricingRows = [
  { brand: "SKIN1004", category: "Skincare", ourPrice: "€19.90", competitor: "€17.90", gap: "-10.1%", action: "Review margin-safe response" },
  { brand: "Rom&nd", category: "Makeup", ourPrice: "€12.50", competitor: "€12.40", gap: "-0.8%", action: "No action needed" },
  { brand: "Australian Gold", category: "Body", ourPrice: "€24.00", competitor: "€21.50", gap: "-10.4%", action: "Priority review" },
  { brand: "Joik", category: "Body", ourPrice: "€15.90", competitor: "€16.40", gap: "+3.1%", action: "Hold price" },
];

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function SectionCard({ title, right, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function GemerCsHub() {
  const [activePage, setActivePage] = useState("Triage");
  const [search, setSearch] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState("CS-2011");

  const filteredCases = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return cases;
    return cases.filter((c) => Object.values(c).join(" ").toLowerCase().includes(q));
  }, [search]);

  const selectedCase = filteredCases.find((c) => c.id === selectedCaseId) || cases[0];

  const pages = {
    Triage: (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {triageCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="text-sm text-slate-500">{card.label}</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</div>
              <div className="mt-3 text-sm text-slate-500">{card.helper}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionCard title="Needs attention today" right={<div className="text-xs text-slate-500">Support-first view</div>}>
            <div className="space-y-3">
              {cases.map((item) => (
                <button key={item.id} onClick={() => {setSelectedCaseId(item.id); setActivePage("Cases");}} className="w-full rounded-3xl border border-slate-200 p-4 text-left transition hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{item.id}</div>
                        <Badge tone={item.priority === "High" ? "red" : "amber"}>{item.priority}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-slate-900">{item.customer} · {item.order}</div>
                      <div className="mt-2 text-sm text-slate-500">{item.note}</div>
                    </div>
                    <Badge tone="blue">{item.type}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="What this dashboard fixes">
            <div className="grid gap-3">
              {[
                "Shows overdue and blocked work without manual morning scanning.",
                "Attaches the reason for delay directly to the order or case.",
                "Brings stock, refund, courier, and campaign context into one support view.",
                "Lets the agent act before the customer has to ask what happened."
              ].map((text) => (
                <div key={text} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{text}</div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    ),
    Cases: (
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard title="Support cases">
          <div className="space-y-3">
            {filteredCases.map((item) => (
              <button key={item.id} onClick={() => setSelectedCaseId(item.id)} className={`w-full rounded-3xl border p-4 text-left transition hover:bg-slate-50 ${selectedCase.id === item.id ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.id}</div>
                      <Badge tone={item.priority === "High" ? "red" : "amber"}>{item.priority}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-slate-900">{item.customer} · {item.order}</div>
                    <div className="mt-2 text-sm text-slate-500">Next step: {item.next}</div>
                  </div>
                  <Badge tone="blue">{item.type}</Badge>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={`Case detail · ${selectedCase.id}`} right={<Badge tone="red">{selectedCase.priority}</Badge>}>
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {[["Customer", selectedCase.customer],["Order", selectedCase.order],["Type", selectedCase.type],["Next action", selectedCase.next]].map(([k,v]) => (
                <div key={k} className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">{k}</div><div className="mt-2 font-medium text-slate-900">{v}</div></div>
              ))}
            </div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{selectedCase.note}</div>
            <div className="grid gap-3 md:grid-cols-3">
              <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">Send customer message</button>
              <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">Escalate internally</button>
              <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">Set follow-up</button>
            </div>
          </div>
        </SectionCard>
      </div>
    ),
    Orders: (
      <SectionCard title="Open orders with delay reason attached">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500"><tr className="border-b border-slate-100"><th className="pb-3 font-medium">Order</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Reason</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Stock</th><th className="pb-3 font-medium">Courier</th><th className="pb-3 font-medium">Refund</th></tr></thead>
            <tbody>{orders.map((o) => <tr key={o.id} className="border-b border-slate-100 last:border-0"><td className="py-4 font-medium">{o.id}</td><td className="py-4">{o.customer}</td><td className="py-4">{o.reason}</td><td className="py-4"><Badge tone={o.status === "Blocked" ? "red" : o.status === "Follow-up" ? "amber" : "blue"}>{o.status}</Badge></td><td className="py-4">{o.stock}</td><td className="py-4">{o.courier}</td><td className="py-4">{o.refund}</td></tr>)}</tbody>
          </table>
        </div>
      </SectionCard>
    ),
    Substitutions: (
      <SectionCard title="Substitution helper">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {substitutionSuggestions.map((s) => (
            <div key={s.missing} className="rounded-3xl border border-slate-200 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-400">Missing product</div>
              <div className="mt-2 text-lg font-semibold">{s.missing}</div>
              <div className="mt-4 text-xs uppercase tracking-wide text-slate-400">Suggested alternative</div>
              <div className="mt-2 font-medium text-slate-900">{s.suggestion}</div>
              <div className="mt-4 text-sm text-slate-500">{s.logic}</div>
              <div className="mt-4"><Badge tone="blue">{s.channel}</Badge></div>
            </div>
          ))}
        </div>
      </SectionCard>
    ),
    Refunds: (
      <SectionCard title="Refund console">
        <div className="grid gap-3">
          {refunds.map((r) => (
            <div key={r.id} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4"><div><div className="font-semibold">{r.id} · {r.order}</div><div className="mt-2 text-sm text-slate-900">{r.customer} · {r.amount}</div><div className="mt-2 text-sm text-slate-500">{r.blocker}</div></div><Badge tone={r.stage === "Pending accounting" ? "red" : "amber"}>{r.stage}</Badge></div>
            </div>
          ))}
        </div>
      </SectionCard>
    ),
    Deliveries: (
      <SectionCard title="Courier exceptions">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{deliveries.map((d) => <div key={d.order} className="rounded-3xl border border-slate-200 p-5"><div className="font-semibold">{d.order}</div><div className="mt-2 text-sm text-slate-900">{d.issue}</div><div className="mt-2 text-sm text-slate-500">Courier: {d.courier}</div><div className="mt-4"><Badge tone="amber">{d.next}</Badge></div></div>)}</div>
      </SectionCard>
    ),
    Campaigns: (
      <SectionCard title="Campaign and gift context">
        <div className="grid gap-3">{campaigns.map((c) => <div key={c.name} className="rounded-3xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-4"><div><div className="font-semibold">{c.name}</div><div className="mt-2 text-sm text-slate-500">Risk: {c.risk}</div><div className="mt-2 text-sm text-slate-500">Affected orders: {c.affected}</div></div><Badge tone={c.risk === "No issue" ? "green" : c.state === "Ends today" ? "amber" : "blue"}>{c.state}</Badge></div></div>)}</div>
      </SectionCard>
    ),
    Analytics: (
      <SectionCard title="Complaint mix">
        <div className="space-y-4">{analytics.map((a) => <div key={a.name}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-800">{a.name}</span><span className="text-slate-500">{a.pct}%</span></div><div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-slate-900" style={{ width: `${a.pct}%` }} /></div></div>)}</div>
      </SectionCard>
    ),
    Customers: (
      <SectionCard title="Support-facing customer context">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{customers.map((c) => <div key={c.name} className="rounded-3xl border border-slate-200 p-5"><div className="flex items-center gap-2"><div className="font-semibold">{c.name}</div><Badge tone={c.value === "VIP" ? "violet" : c.value === "High" ? "blue" : "slate"}>{c.value}</Badge></div><div className="mt-3 text-sm text-slate-500">{c.history}</div><div className="mt-2 text-sm text-slate-500">Preferred channel: {c.channel}</div><div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">{c.guidance}</div></div>)}</div>
      </SectionCard>
    ),
    "Pricing Insights": (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Competitor pricing monitor"
          right={<div className="text-xs text-slate-500">Category + brand view</div>}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-100">
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Our price</th>
                  <th className="pb-3 font-medium">Competitor</th>
                  <th className="pb-3 font-medium">Gap</th>
                  <th className="pb-3 font-medium">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row) => (
                  <tr key={`${row.brand}-${row.category}`} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 font-medium">{row.brand}</td>
                    <td className="py-4">{row.category}</td>
                    <td className="py-4">{row.ourPrice}</td>
                    <td className="py-4">{row.competitor}</td>
                    <td className="py-4">
                      <span className={`font-medium ${row.gap.startsWith("-") ? "text-red-600" : "text-emerald-600"}`}>
                        {row.gap}
                      </span>
                    </td>
                    <td className="py-4">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Pricing actions">
          <div className="grid gap-3">
            {[
              "Flag hero SKUs where competitor price gap is large enough to hurt conversion.",
              "Protect margin by identifying categories where no action is needed.",
              "Use category and brand grouping to prioritize reviews in price-sensitive markets.",
              "Support market-entry decisions with a clearer competitor gap overview.",
            ].map((text) => (
              <div key={text} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {text}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    ),
    Settings: (
      <SectionCard title="Rules and integrations">
        <div className="grid gap-3 md:grid-cols-2">{[
          "Order overdue threshold and stuck-order flag rules",
          "Refund orchestration settings across ERP, commerce, and payments",
          "Campaign visibility and gift mismatch detection",
          "Courier exception syncing and proactive outreach triggers"
        ].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{item}</div>)}</div>
      </SectionCard>
    ),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white xl:flex xl:flex-col">
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-sm font-bold text-white">G</div>
            <div>
              <div className="text-sm font-semibold">Gemer CS Hub</div>
              <div className="text-xs text-slate-500">Support control center</div>
            </div>
          </div>
          <nav className="space-y-1 p-4 text-sm">
            {navItems.map((item) => (
              <button key={item} onClick={() => setActivePage(item)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${activePage === item ? "bg-slate-900 text-white shadow-soft" : "text-slate-600 hover:bg-slate-100"}`}>
                <span>{item}</span>
                {item === "Cases" ? <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${activePage === item ? "bg-white/20 text-white" : "bg-red-100 text-red-700"}`}>{cases.length}</span> : null}
              </button>
            ))}
          </nav>
          <div className="m-4 mt-auto rounded-3xl bg-slate-900 p-4 text-white">
            <div className="text-sm font-semibold">Today’s goal</div>
            <p className="mt-2 text-sm text-slate-300">Stop support from firefighting by surfacing stuck orders, likely causes, and next actions in one view.</p>
            <button onClick={() => setActivePage("Triage")} className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-900">Open triage</button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{activePage}</h1>
                <p className="mt-1 text-sm text-slate-500">Customer support dashboard for efficient support operations.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-72 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400" placeholder="Search case, customer, order..." />
                <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">Export queue</button>
                <button className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Create follow-up</button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 xl:hidden">
              {navItems.map((item) => (
                <button key={item} onClick={() => setActivePage(item)} className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm ${activePage === item ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{item}</button>
              ))}
            </div>
          </header>
          <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">{pages[activePage]}</div>
        </main>
      </div>
    </div>
  );
}
