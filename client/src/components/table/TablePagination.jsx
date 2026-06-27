const TablePagination = ({
    page,
    totalPages,
    onPrev,
    onNext,
}) => {

    return (

        <div className="flex justify-end gap-4 mt-6">

            <button
                onClick={onPrev}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded"
            >

                Previous

            </button>

            <span>

                {page} / {totalPages}

            </span>

            <button
                onClick={onNext}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded"
            >

                Next

            </button>

        </div>

    );

};

export default TablePagination;