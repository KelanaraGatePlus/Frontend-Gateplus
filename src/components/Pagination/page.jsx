/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Pagination, Stack } from "@mui/material";

export default function PaginationRounded() {
  return (
    <Stack className="my-5">
      <Pagination
        className="flex justify-center rounded-2xl bg-amber-200"
        boundaryCount={2}
        count={6}
        showFirstButton
        shape="rounded"
        variant="outlined"
        color="secondary"
        size="medium"
        siblingCount={5}
      />
    </Stack>
  );
}
