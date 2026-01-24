import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import { Icon } from '@iconify/react';

export default function InputEducationLevel({ onChange, error, value }) {
    return (
        <div className="flex items-center gap-2">
            <div className='flex flex-row gap-1 items-center flex-2'>
                <h3 className="montserratFont text-base font-semibold text-white md:text-base lg:text-xl">
                    Level Kursus
                </h3>
            </div>
            <div className="flex w-full flex-10 flex-wrap justify-start gap-x-6 text-white md:flex-10 montserratFont">
                <div className='flex flex-col gap-0'>
                    <FormControl component="fieldset" required>
                        <RadioGroup
                            row
                            name="rating"
                            value={value || ""}
                            onChange={onChange}
                        >
                            <FormControlLabel
                                value="FOUNDATION"
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
                                label={
                                    <div className='flex flex-col gap-0'>
                                        <span className="text-white font-bold montserratFont text-sm">Kelas Dasar (Foundation)</span>
                                        <span className='text-[#979797] text-xs montserratFont'>Cocok untuk pemula yang baru ingin memulai dari nol.</span>
                                    </div>
                                }

                            />
                            <FormControlLabel
                                value="DEVELOPMENT"
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
                                label={
                                    <div className='flex flex-col gap-0'>
                                        <span className="text-white font-bold montserratFont text-sm">Kelas Pengembangan (Development)</span>
                                        <span className='text-[#979797] text-xs montserratFont'>Untuk yang sudah punya dasar dan ingin mempertajam skill.</span>
                                    </div>
                                }

                            />
                            <FormControlLabel
                                value="PROFESSIONAL"
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
                                label={
                                    <div className='flex flex-col gap-0'>
                                        <span className="text-white font-bold montserratFont text-sm">Kelas Profesional (Professional)</span>
                                        <span className='text-[#979797] text-xs montserratFont'>Fokus pada studi kasus kompleks dan standar industri tingkat lanjut.</span>
                                    </div>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                    <p className='text-[#979797]'>Fokus pada studi kasus kompleks dan standar industri tingkat lanjut.</p>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    )
}

InputEducationLevel.propTypes = {
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    value: PropTypes.string,
};
