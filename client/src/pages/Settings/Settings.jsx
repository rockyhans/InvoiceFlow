import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import FormInput from "../../components/forms/FormInput";
import { getSettings, updateSettings } from "../../api/settingsApi";

const TABS = ["Business", "Tax", "Invoice", "Quote"];

const Settings = () => {

    const [activeTab, setActiveTab] = useState("Business");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");

    const [business, setBusiness] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        gstNumber: "",
        logo: "",
    });

    const [tax, setTax] = useState({
        taxName: "GST",
        taxPercentage: 18,
        pricesInclusiveOfTax: false,
    });

    const [invoice, setInvoice] = useState({
        prefix: "INV-",
        nextNumber: 1,
        dueDays: 14,
        terms: "",
    });

    const [quote, setQuote] = useState({
        prefix: "QT-",
        nextNumber: 1,
        validDays: 15,
        terms: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const { data } = await getSettings();
                const s = data.data;
                if (s.business) setBusiness(s.business);
                if (s.tax) setTax(s.tax);
                if (s.invoice) setInvoice(s.invoice);
                if (s.quote) setQuote(s.quote);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            setSuccess("");
            const payload = {
                Business: { business },
                Tax: { tax },
                Invoice: { invoice },
                Quote: { quote },
            }[activeTab];
            await updateSettings(payload);
            setSuccess("Settings saved successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    const businessField = (label, key, type = "text") => (
        <FormInput
            label={label}
            name={key}
            type={type}
            value={business[key]}
            placeholder={label}
            onChange={(e) => setBusiness({ ...business, [key]: e.target.value })}
        />
    );

    const invoiceField = (label, key, type = "text") => (
        <FormInput
            label={label}
            name={key}
            type={type}
            value={invoice[key]}
            placeholder={label}
            onChange={(e) =>
                setInvoice({
                    ...invoice,
                    [key]: type === "number" ? Number(e.target.value) : e.target.value,
                })
            }
        />
    );

    const quoteField = (label, key, type = "text") => (
        <FormInput
            label={label}
            name={key}
            type={type}
            value={quote[key]}
            placeholder={label}
            onChange={(e) =>
                setQuote({
                    ...quote,
                    [key]: type === "number" ? Number(e.target.value) : e.target.value,
                })
            }
        />
    );

    if (loading) {
        return (
            <DashboardLayout>
                <Card>
                    <Loader text="Loading settings..." />
                </Card>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Card>

                <h1 className="text-2xl font-bold mb-6">Settings</h1>

                <div className="flex border-b mb-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setSuccess("");
                            }}
                            className={`px-5 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "Business" && (
                    <div className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {businessField("Business Name", "name")}
                            {businessField("Email", "email", "email")}
                            {businessField("Phone", "phone", "tel")}
                            {businessField("Website", "website")}
                            {businessField("GST Number", "gstNumber")}
                            {businessField("Logo URL", "logo")}
                        </div>
                        <div>
                            <label className="block mb-1.5 font-medium text-sm text-gray-700">
                                Address
                            </label>
                            <textarea
                                rows={3}
                                value={business.address}
                                placeholder="Address"
                                onChange={(e) =>
                                    setBusiness({ ...business, address: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Tax" && (
                    <div className="space-y-4 max-w-md">
                        <FormInput
                            label="Tax Name"
                            name="taxName"
                            value={tax.taxName}
                            placeholder="Tax Name"
                            onChange={(e) => setTax({ ...tax, taxName: e.target.value })}
                        />
                        <FormInput
                            label="Tax Percentage (%)"
                            name="taxPercentage"
                            type="number"
                            value={tax.taxPercentage}
                            placeholder="Tax Percentage (%)"
                            onChange={(e) =>
                                setTax({ ...tax, taxPercentage: Number(e.target.value) })
                            }
                        />
                        <div className="flex items-center gap-3 pt-1">
                            <input
                                type="checkbox"
                                id="inclusive"
                                checked={tax.pricesInclusiveOfTax}
                                onChange={(e) =>
                                    setTax({ ...tax, pricesInclusiveOfTax: e.target.checked })
                                }
                                className="w-4 h-4 accent-blue-600"
                            />
                            <label htmlFor="inclusive" className="text-sm font-medium text-gray-700">
                                Prices entered inclusive of tax
                            </label>
                        </div>
                    </div>
                )}

                {activeTab === "Invoice" && (
                    <div className="space-y-4 max-w-md">
                        {invoiceField("Invoice Prefix", "prefix")}
                        {invoiceField("Next Invoice Number", "nextNumber", "number")}
                        {invoiceField("Payment Due Days", "dueDays", "number")}
                        <div>
                            <label className="block mb-1.5 font-medium text-sm text-gray-700">
                                Terms & Conditions
                            </label>
                            <textarea
                                rows={4}
                                value={invoice.terms}
                                placeholder="Terms & Conditions"
                                onChange={(e) =>
                                    setInvoice({ ...invoice, terms: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "Quote" && (
                    <div className="space-y-4 max-w-md">
                        {quoteField("Quote Prefix", "prefix")}
                        {quoteField("Next Quote Number", "nextNumber", "number")}
                        {quoteField("Quote Valid Days", "validDays", "number")}
                        <div>
                            <label className="block mb-1.5 font-medium text-sm text-gray-700">
                                Terms & Conditions
                            </label>
                            <textarea
                                rows={4}
                                value={quote.terms}
                                placeholder="Terms & Conditions"
                                onChange={(e) =>
                                    setQuote({ ...quote, terms: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 mt-8">
                    <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
                        {saving ? "Saving..." : "Save Settings"}
                    </Button>
                    {success && (
                        <span className="text-green-600 text-sm font-medium animate-pulse">
                            ✓ {success}
                        </span>
                    )}
                </div>

            </Card>
        </DashboardLayout>
    );

};

export default Settings;