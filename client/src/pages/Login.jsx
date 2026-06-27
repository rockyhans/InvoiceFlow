import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import useAuth from "../hooks/useAuth";

import FormInput from "../components/forms/FormInput";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

const validate = (formData) => {
    const errors = {};

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
        errors.password = "Password is required";
    } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};

const Login = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setServerError("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allTouched = { email: true, password: true };
        setTouched(allTouched);

        const validationErrors = validate(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            setLoading(true);
            setServerError("");
            const { data } = await API.post("/auth/login", formData);
            login(data.admin, data.token);
            navigate("/dashboard");
        } catch (error) {
            setServerError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 bg-gradient-to-r from-blue-100 to-blue-200">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 text-orange-500 ">Welcome back</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>

                {serverError && (
                    <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">

                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={touched.email ? errors.email : ""}
                    />

                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={touched.password ? errors.password : ""}
                    />

                    <div className="pt-2">
                        <Button type="submit" disabled={loading} className="w-full justify-center">
                            {loading ? <Loader size="sm" text="" /> : "Login"}
                        </Button>
                    </div>

                </form>

            </div>
        </div>
    );

};

export default Login;