import { XIcon } from "flowbite-react";

export default function FlexModal({ isOpen, onClose, title, children }) {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
            {/* Background Overlay */}
            <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="bg-[#515151] rounded-lg p-4 z-50 relative min-w-2xl w-max">
                <div className="flex flex-row w-full justify-between items-center py-1">
                    <h2 className="text-white text-lg font-semibold ">{title}</h2>
                    <button onClick={onClose} className="bg-[#979797] hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-full">
                        <XIcon className="text-white w-full h-full p-2" />
                    </button>
                </div>

                <div className="flex justify-between w-full py-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
