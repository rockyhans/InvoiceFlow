import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const { user } = useAuth();

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    return (
        <div className="bg-white/80 backdrop-blur-md h-16 flex items-center justify-end px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="leading-tight text-right">
                    <div className="font-semibold text-gray-800 text-sm">
                        {user?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {user?.email}
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r bg-orange-400 text-white flex items-center justify-center font-bold">
                    {getInitial(user?.name)}
                </div>
            </div>
        </div>
    );
};

export default Navbar;