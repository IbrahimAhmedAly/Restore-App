import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPrdouctParams } from "./catalogSlice";
import { useState } from "react";

const ProductSearch = () => {
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const deboundedSearch = debounce((event: any) => {
    dispatch(setPrdouctParams({ searchTerm: event.target.value }));
  }, 1000);

  return (
    <div>
      <TextField
        label="search products"
        variant="outlined"
        fullWidth
        value={searchTerm || ""}
        onChange={(event: any) => {
          setSearchTerm(event.target.value);
          deboundedSearch(event);
        }}
      />
    </div>
  );
};

export default ProductSearch;
