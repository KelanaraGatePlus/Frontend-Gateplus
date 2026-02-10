import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import { Icon } from '@iconify/react';

export default function InputAgeResctriction({ onChange, error }) {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div className="flex items-center gap-2">
            <div className='flex flex-row gap-1 items-center flex-2'>
                <h3 className="montserratFont text-base font-semibold text-white md:text-base lg:text-xl">
                    Rating Batasan Usia (Age Restriction)
                </h3>
                <button onClick={() => setModalOpen(true)}>
                    <Icon icon={"solar:info-circle-outline"} className='text-white' width={24} height={24} />
                </button>
            </div>
            <div className="flex w-fit flex-4 flex-wrap justify-start gap-x-6 text-white md:flex-10 montserratFont">
                <div className='flex flex-col gap-0'>
                    <FormControl component="fieldset" required>
                        <RadioGroup
                            row
                            name="rating"
                            onChange={onChange}
                        >
                            <FormControlLabel
                                value="SU"
                                control={
                                    <Radio
                                        sx={{
                                            color: "white",
                                            "&.Mui-checked": {
                                                color: "cyan",
                                            },
                                        }}
                                    />
                                }
                                label={<span className="text-white">SU</span>}

                            />
                            <FormControlLabel
                                value="R13"
                                control={
                                    <Radio
                                        sx={{
                                            color: "white",
                                            "&.Mui-checked": {
                                                color: "cyan",
                                            },
                                        }}
                                    />
                                }
                                label={<span className="text-white">R13+</span>}

                            />
                            <FormControlLabel
                                value="D17"
                                control={
                                    <Radio
                                        sx={{
                                            color: "white",
                                            "&.Mui-checked": {
                                                color: "cyan",
                                            },
                                        }}
                                    />
                                }
                                label={<span className="text-white">D17+</span>}

                            />
                            <FormControlLabel
                                value="D21"
                                control={
                                    <Radio
                                        sx={{
                                            color: "white",
                                            "&.Mui-checked": {
                                                color: "cyan",
                                            },
                                        }}
                                    />
                                }
                                label={<span className="text-white">D21+</span>}

                            />
                        </RadioGroup>
                    </FormControl>
                    <p className='text-[#979797]'>Pilih rating yang sesuai target audiens (Contoh: SU, R13+, D17+, atau standar lembaga sensor resmi).</p>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Detail Age Restriction */}
            {modalOpen &&
                <div className='fixed flex flex-col gap-6 w-3/4 bg-[#f5f5f5]/70 backdrop-blur-xs top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl z-50'>
                    <div className='flex flex-row w-full justify-between items-center'>
                        <h3 className='font-bold montserratFont text-[#222222]'>
                            Kategori Pembatasan Usia Konten di Indonesia
                        </h3>
                        <button onClick={() => setModalOpen(false)}>
                            <Icon
                                icon={'solar:close-circle-bold-duotone'}
                                width={32}
                                height={32}
                                className='text-white'
                            />
                        </button>
                    </div>
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-1/6 p-4 text-center font-semibold rounded-l-lg">
                                    Kategori
                                </th>
                                <th className="w-5/6 p-4 text-center font-semibold rounded-r-lg">
                                    Syarat
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-[#222222] font-medium">
                            <tr>
                                <td className="w-1/6 px-4 py-3 align-middle font-bold">
                                    SU (Semua Umur)
                                </td>
                                <td className="w-5/6 px-4 py-3">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Cocok untuk semua</li>
                                        <li>
                                            Tidak mengandung unsur kekerasan, pornografi, narkoba, atau hal negatif
                                        </li>
                                        <li>
                                            Biasanya konten edukatif, hiburan keluarga, atau animasi anak-anak
                                        </li>
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <td className="w-1/6 px-4 py-3 align-middle font-bold">
                                    13+ (Remaja Awal)
                                </td>
                                <td className="w-5/6 px-4 py-3">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Dapat diakses oleh usia 13 tahun ke atas</li>
                                        <li>Mengandung kekerasan ringan atau tema yang lebih kompleks</li>
                                        <li>
                                            Tidak mengandung unsur seksual, narkoba, atau kekerasan ekstrem
                                        </li>
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <td className="w-1/6 px-4 py-3 align-middle font-bold">
                                    17+ (Remaja Akhir / Dewasa Muda)
                                </td>
                                <td className="w-5/6 px-4 py-3">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Dapat diakses oleh usia 17 tahun ke atas</li>
                                        <li>
                                            Bisa mengandung kekerasan, tema sosial kompleks, atau unsur horor
                                        </li>
                                        <li>
                                            Tidak boleh ada adegan seksual eksplisit atau konten yang sangat sensitif
                                        </li>
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <td className="w-1/6 px-4 py-3 align-middle font-bold">
                                    21+ (Dewasa)
                                </td>
                                <td className="w-5/6 px-4 py-3">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Hanya untuk usia 21 tahun ke atas</li>
                                        <li>
                                            Bisa mengandung unsur kekerasan ekstrem, tema politik kompleks,
                                            adegan seksual, atau konten eksplisit lainnya
                                        </li>
                                        <li>
                                            Biasanya diterapkan untuk film dewasa, dokumenter khusus, atau game
                                            dengan tema brutal
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

InputAgeResctriction.propTypes = {
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};
