import React from 'react';
import PropTypes from 'prop-types';
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

export default function InputAgeResctriction({ onChange, error }) {
    return (
        <div className="flex items-center gap-2">
            <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                Age Restrictions
            </h3>
            <div className="lex w-fit flex-4 flex-wrap justify-start gap-x-6 text-white md:flex-10 montserratFont">
                <div>
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
                                className="flex-1"
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
                                className="flex-1"
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
                                className="flex-1"
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
                                className="flex-1"
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    )
}

InputAgeResctriction.propTypes = {
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};
