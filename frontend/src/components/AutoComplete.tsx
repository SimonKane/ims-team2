import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { Product } from "../../shared/types";
import type { Manufacturer } from "../../shared/types";

interface SearchBoxProps {
  products: Product[] | Manufacturer[];
  onSearch: (value: string) => void;
  value: string;
  choice?: string;
}

const AutoCompleteSearchBox = ({
  products,
  onSearch,
  value,
  choice,
}: SearchBoxProps) => {
  return (
    <Autocomplete
      freeSolo
      inputValue={value}
      disablePortal
      disableClearable
      popupIcon={null}
      options={products.map((product): string => product.name)}
      sx={{ width: 300 }}
      onInputChange={(_, v) => onSearch(v)}
      disabled={!choice}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={
            choice
              ? choice === "products"
                ? "Search Products"
                : "Search Manufacturers"
              : "Search disabled"
          }
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 32,
              borderRadius: "6px",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },
          }}
        />
      )}
    />
  );
};
export default AutoCompleteSearchBox;
