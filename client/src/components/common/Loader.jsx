const Loader = ({ size = "md", text = "Loading..." }) => {

    const sizes = {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16",
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 py-10">

            <div className="relative flex items-center justify-center">

                <div className={`${sizes[size]} rounded-full border-4 border-gray-100 border-t-blue-500 border-r-blue-300 animate-spin`} />

                <div className={`absolute ${size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : "h-8 w-8"} rounded-full bg-blue-50 animate-pulse`} />

            </div>

            {text && (
                <p className="text-sm text-gray-400 tracking-wide animate-pulse">
                    {text}
                </p>
            )}

        </div>
    );

};

export default Loader;