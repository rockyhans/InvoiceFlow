import Modal from "./Modal";
import Button from "../common/Button";

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
}) => {

    return (

        <Modal
            isOpen={open}
            title="Confirm Delete"
            onClose={onClose}
        >

            <p>

                Are you sure you want to delete this record?

            </p>

            <div className="flex justify-end gap-3 mt-6">

                <Button
                    className="bg-gray-500 hover:bg-gray-600"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={onConfirm}
                >
                    Delete
                </Button>

            </div>

        </Modal>

    );

};

export default ConfirmModal;