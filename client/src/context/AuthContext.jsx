import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const admin = localStorage.getItem("admin");

        if (admin) {

            setUser(JSON.parse(admin));

        }

        setLoading(false);

    }, []);

    const login = (admin, token) => {

        localStorage.setItem(
            "admin",
            JSON.stringify(admin)
        );

        localStorage.setItem("token", token);

        setUser(admin);

    };

    const logout = () => {

        localStorage.clear();

        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export default AuthContext;