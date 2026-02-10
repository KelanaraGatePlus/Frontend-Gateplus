"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";

export default function InputMultiString({
    label,
    placeholder = "Tambahkan item",
    values = [],
    onChange,
    error,
    addButtonLabel = "+ Tambah",
    removeButtonLabel = "Hapus",
    description,
}) {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        if (inputValue.trim()) {
            onChange([...values, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleRemove = (index) => {
        const newValues = values.filter((_, i) => i !== index);
        onChange(newValues);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="flex items-start gap-2">
            <h3 className="montserratFont flex-2 text-base font-semibold text-white md:text-base lg:text-xl">
                {label}
            </h3>
            
            <div className="flex w-full flex-4 text-white md:flex-10 flex-col">
                {description && (
                    <p className="text-xs text-[#979797] mb-2 montserratFont">{description}</p>
                )}

                <div className={`${error && "border-red-500"} w-full rounded-md border border-[#F5F5F540] bg-[#2a2a2a] p-3`}>
                    {/* Input untuk menambah item */}
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 rounded-md border border-[#F5F5F540] bg-[#1a1a1a] px-2 py-2 transition-all duration-200 focus:border-blue-500 focus:outline-none montserratFont text-sm font-normal placeholder:text-sm placeholder:text-[#979797]"
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!inputValue.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-[#3a3a3a] disabled:text-[#666] disabled:cursor-not-allowed transition-colors montserratFont font-medium"
                        >
                            {addButtonLabel}
                        </button>
                    </div>

                    {/* List item yang sudah ditambahkan */}
                    {values.length > 0 ? (
                        <div className="space-y-2">
                            {values.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-[#1a1a1a] rounded-md border border-[#F5F5F540]"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full montserratFont">
                                        {index + 1}
                                    </span>
                                    <span className="flex-1 text-white text-sm montserratFont">
                                        {item}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors montserratFont"
                                    >
                                        {removeButtonLabel}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-[#979797] text-sm montserratFont">
                            Belum ada item. Tambahkan item pertama Anda.
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 text-sm mt-1 montserratFont">{error}</p>}
            </div>
        </div>
    );
}

InputMultiString.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    addButtonLabel: PropTypes.string,
    removeButtonLabel: PropTypes.string,
    description: PropTypes.string,
};
