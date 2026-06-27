import { useState, useEffect } from "react";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const REQUIRED_FIELDS = [
    "name", "companyName", "email", "phone",
    "gstNumber", "address", "city", "state", "country", "postalCode"
];

const validate = (formData) => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.companyName.trim()) errors.companyName = "Company name is required";

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
        errors.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        errors.phone = "Enter a valid 10-digit Indian phone number";
    }

    if (!formData.gstNumber.trim()) {
        errors.gstNumber = "GST number is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
        errors.gstNumber = "Enter a valid GST number (e.g. 22ABCDE1234F1Z5)";
    }

    if (!formData.address.trim()) errors.address = "Address is required";

    if (!formData.city.trim()) errors.city = "City is required";

    if (!formData.state.trim()) errors.state = "State is required";

    if (!formData.country.trim()) errors.country = "Country is required";

    if (!formData.postalCode.trim()) {
        errors.postalCode = "Postal code is required";
    } else if (!/^[1-9][0-9]{5}$/.test(formData.postalCode)) {
        errors.postalCode = "Enter a valid 6-digit postal code";
    }

    return errors;
};

const ClientForm = ({ initialData, onSubmit, submitLoading = false }) => {

    const [formData, setFormData] = useState({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        gstNumber: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const updatedErrors = validate({ ...formData, [name]: value });
            setErrors((prev) => ({ ...prev, [name]: updatedErrors[name] || "" }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const updatedErrors = validate(formData);
        setErrors((prev) => ({ ...prev, [name]: updatedErrors[name] || "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allTouched = REQUIRED_FIELDS.reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        onSubmit(formData);
    };

    const field = (label, name, type = "text") => (
        <FormInput
            label={label}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={label}
            required
            error={touched[name] ? errors[name] : ""}
        />
    );

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Basic Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {field("Name", "name")}
                    {field("Company Name", "companyName")}
                    {field("Email", "email", "email")}
                    {field("Phone", "phone", "tel")}
                    {field("GST Number", "gstNumber")}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {field("Address", "address")}
                    {field("City", "city")}
                    {field("State", "state")}
                    {field("Country", "country")}
                    {field("Postal Code", "postalCode")}
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <Button type="submit" loading={submitLoading}>
                    {submitLoading
                        ? "Saving..."
                        : "Save Client"
                    }                </Button>
            </div>

        </form>
    );

};

export default ClientForm;