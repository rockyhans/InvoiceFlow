import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, title, children, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >

                    <motion.div
                        className="absolute inset-0 bg-black/60"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            },
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10,
                            transition: { duration: 0.15 },
                        }}
                    >

                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {title}
                            </h2>

                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-red-500 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-6 py-5 overflow-y-auto">
                            {children}
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;