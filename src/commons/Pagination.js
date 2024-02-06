const Pagination = ({ itemsPerPage, totalItems, currentPage, onPageChange, onPrevClick, onNextClick }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageGroupSize = 10;
    const totalPageGroups = Math.ceil(totalPages / pageGroupSize);
    const currentGroup = Math.ceil(currentPage / pageGroupSize);

    const startPage = (currentGroup - 1) * pageGroupSize + 1;
    const endPage = Math.min(currentGroup * pageGroupSize, totalPages);

    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex mx-auto w-fit" style={{fontFamily: 'Pretendard-Regular'}}>
            <button onClick={onPrevClick} className="w-16 text-xl border-none rounded-sm border shadow-md mx-3 font-normal" id="hoverBtn">
                Prev
            </button>
            <ul>
                {pageNumbers.map((number) => (
                    <button key={number} onClick={() => onPageChange(number)}>
                        <li className={`w-8 text-xl border-none rounded-sm border shadow-md mx-3 font-normal ${currentPage === number ? 'bg-gray-300' : ''}`} id="hoverBtn">
                            {number}
                        </li>
                    </button>
                ))}
            </ul>
            <button
                onClick={onNextClick}
                className="w-16 text-xl border-none rounded-sm border shadow-md mx-3 font-normal" id="hoverBtn"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;