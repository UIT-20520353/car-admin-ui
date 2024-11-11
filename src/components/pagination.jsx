import { useMemo } from "react";

const Pagination = ({ page, size, total, onPageChange }) => {
  const totalPages = useMemo(() => Math.ceil(total / size), [total, size]);

  return (
    <div className="flex items-center gap-3">
      <button
        className={`flex items-center justify-center w-8 text-gray-600 border border-gray-600 rounded-lg aspect-square disabled:border-gray-300 disabled:text-gray-300 ${
          page !== 0 &&
          "hover:bg-custom-dark-blue-1 hover:text-white hover:border-transparent"
        }`}
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={20}
          height={20}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          onClick={() => onPageChange(index)}
          className={`flex items-center justify-center w-8 text-gray-600 duration-300 border border-gray-600 rounded-lg aspect-square hover:bg-custom-dark-blue-1 hover:text-white hover:border-transparent ${
            page === index &&
            "bg-custom-dark-blue-1 text-white border-transparent"
          }`}
          disabled={page === index}
        >
          {index + 1}
        </button>
      ))}

      <button
        className={`flex items-center justify-center w-8 text-gray-600 border border-gray-600 rounded-lg aspect-square disabled:border-gray-300 disabled:text-gray-300 ${
          page !== totalPages - 1 &&
          "hover:bg-custom-dark-blue-1 hover:text-white hover:border-transparent"
        }`}
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={20}
          height={20}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
