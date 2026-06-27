const FormInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
    error = "",
}) => {

    return (
        <div className="mb-4">
            <label className="block mb-1.5 font-medium text-sm text-gray-700">
                {label}
                {required && (
                    <span className="text-red-500 ml-1" aria-label="required">*</span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                aria-required={required}
                className={`w-full border rounded-lg px-4 py-3 outline-none transition-all
                    focus:ring-2 focus:ring-blue-500
                    ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            />

            {error && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;