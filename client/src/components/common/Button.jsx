const Button = ({
    children,
    type = "button",
    onClick,
    className = "",
    disabled = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-400 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;