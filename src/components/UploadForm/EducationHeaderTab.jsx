import React from 'react';
import Image from "next/image";
import ArrowRight from "@@/icons/icons-arrow-right.svg";
import PropTypes from 'prop-types';

export default function EducationHeaderTab({ step, setStep }) {
    return (
        <section className="montserratFont mb-4 flex flex-row items-center justify-center gap-3">
            {/* STEP 1 */}
            <div className="flex flex-row items-center justify-center gap-1.5 rounded-full">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${step == 1 ? 'bg-[#1DBDF580] text-white' : 'bg-white/25 text-[#979797]'
                        }`}
                >
                    1
                </span>
                <div className='flex flex-col'>
                    <span
                        className={`gap-1.5 text-xl font-bold ${step == 1 ? 'text-[#1DBDF580]' : 'text-[#979797]'
                            }`}
                    >
                        <button onClick={() => setStep(1)}>Basic Information</button>
                    </span>
                    <span
                        className='text-[#979797] montserratFont text-sm'
                    >
                        <button onClick={() => setStep(1)}>Informasi dasar course</button>
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div>
                <Image src={ArrowRight} alt="arrow-right" />
            </div>

            {/* STEP 2 */}
            <div className="flex flex-row items-center gap-1.5 rounded-full">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${step == 2 ? 'bg-[#1DBDF580] text-white' : 'bg-white/25 text-[#979797]'
                        }`}
                >
                    2
                </span>
                <div className='flex flex-col'>
                    <span
                        className={`gap-1.5 text-xl font-bold ${step == 2 ? 'text-[#1DBDF580]' : 'text-[#979797]'
                            }`}
                    >
                        <button onClick={() => setStep(2)}>Learning Rules</button>
                    </span>
                    <span
                        className='text-[#979797] montserratFont text-sm'
                    >
                        <button onClick={() => setStep(2)}>Aturan Pembelajaran</button>
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div>
                <Image src={ArrowRight} alt="arrow-right" />
            </div>

            {/* STEP 2 */}
            <div className="flex flex-row items-center gap-1.5 rounded-full">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${step == 3 ? 'bg-[#1DBDF580] text-white' : 'bg-white/25 text-[#979797]'
                        }`}
                >
                    3
                </span>
                <div className='flex flex-col'>
                    <span
                        className={`gap-1.5 text-xl font-bold ${step == 3 ? 'text-[#1DBDF580]' : 'text-[#979797]'
                            }`}
                    >
                        <button onClick={() => setStep(3)}>Episode</button>
                    </span>
                    <span
                        className='text-[#979797] montserratFont text-sm'
                    >
                        <button onClick={() => setStep(3)}>Informasi detail episode untuk course</button>
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div>
                <Image src={ArrowRight} alt="arrow-right" />
            </div>

            {/* STEP 2 */}
            <div className="flex flex-row items-center gap-1.5 rounded-full">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${step == 4 ? 'bg-[#1DBDF580] text-white' : 'bg-white/25 text-[#979797]'
                        }`}
                >
                    4
                </span>
                <div className='flex flex-col'>
                    <span
                        className={`gap-1.5 text-xl font-bold ${step == 4 ? 'text-[#1DBDF580]' : 'text-[#979797]'
                            }`}
                    >
                        <button onClick={() => setStep(4)}>Preview & Publish</button>
                    </span>
                    <span
                        className='text-[#979797] montserratFont text-sm'
                    >
                        <button onClick={() => setStep(4)}>Review dan Terbitkan</button>
                    </span>
                </div>
            </div>
        </section>
    );
}

EducationHeaderTab.propTypes = {
    type: PropTypes.string,
    setStep: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired,
}