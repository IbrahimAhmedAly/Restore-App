import { useEffect } from "react";
import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchFilters,
  fetchProductAsync,
  productsSelectors,
  setPrdouctParams,
} from "./catalogSlice";
import { Box, Grid, Pagination, Paper, Typography } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "price - High to low" },
  { value: "price", label: "Price - Low to high" },
];

const Catalog = () => {
  const products = useAppSelector(productsSelectors.selectAll);
  const {
    productsLoaded,
    status,
    filtersLoaded,
    brands,
    types,
    productParams,
  } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [filtersLoaded, dispatch]);

  if (status.includes("pending"))
    return <LoadingComponent message="Products loading..." />;

  return (
    <Grid container spacing={4}>
      <Grid item md={3} sm={4} xs={6}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            options={sortOptions}
            onChange={(e) =>
              dispatch(setPrdouctParams({ orderBy: e.target.value }))
            }
            selectedValue={productParams.orderBy}
          />
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <CheckboxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) =>
              dispatch(setPrdouctParams({ brands: items }))
            }
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) =>
              dispatch(setPrdouctParams({ types: items }))
            }
          />
        </Paper>
      </Grid>
      <Grid item md={9} sm={8} xs={6}>
        <ProductList products={products} />
      </Grid>
      <Grid item md={4} xs={2} />
      <Grid item md={8} xs={10}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={7}
        >
          <Typography>Displaying 1-5 of 20 items</Typography>
          <Pagination color="secondary" size="large" count={10} page={1} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Catalog;
