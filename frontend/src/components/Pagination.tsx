import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PaginationBoxProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBox({
  page,
  totalPages,
  onPageChange,
}: PaginationBoxProps) {
  return (
    <Stack spacing={2}>
      <Pagination
        page={page}
        count={totalPages}
        onChange={(_, value) => {
          onPageChange(value);
        }}
        shape="rounded"
      />
    </Stack>
  );
}
