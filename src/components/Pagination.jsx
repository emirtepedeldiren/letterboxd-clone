function Pagination({ currentPage, totalPages, onPageChange }) {

    const getPages = () => {
        const pages = [];

        // İlk sayfa
        pages.push(1);

        // Bulunduğumuz 100'lük aralığın sonu
        const currentBlock = Math.ceil(currentPage / 100);
        const blockStart = (currentBlock - 1) * 100 + 1;
        const blockEnd = Math.min(currentBlock * 100, totalPages);

        // Eğer 1. blokta değilsek
        if (blockStart > 1) {
            pages.push("...");
        }

        // Bulunduğumuz aralıktaki sayfalar
        const start = Math.max(blockStart, currentPage - 2);
        const end = Math.min(blockEnd, currentPage + 2);

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        // Bloğun sonuna geldiysek sonraki bloğun sonunu göster
        if (currentPage === blockEnd && blockEnd < totalPages) {
            pages.push(blockEnd + 1);
            pages.push("...");
            pages.push(Math.min(blockEnd + 100, totalPages));
        }
        else if (blockEnd < totalPages) {
            pages.push("...");
            pages.push(blockEnd);
        }

        return pages;
    };

    return (
        <div className="pagination">

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ‹
            </button>

            {getPages().map((page, index) =>
                page === "..." ? (
                    <span
                        key={`dots-${index}`}
                        className="pagination-dots"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={`${page}-${index}`}
                        onClick={() => onPageChange(page)}
                        className={currentPage === page ? "active" : ""}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                ›
            </button>

        </div>
    );
}

export default Pagination;