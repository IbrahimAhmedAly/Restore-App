import { useEffect } from "react";
import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchFilters,
  fetchProductAsync,
  productsSelectors,
  setPageNumber,
  setPrdouctParams,
} from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "price - High to low" },
  { value: "price", label: "Price - Low to high" },
];

const Catalog = () => {
  const products = useAppSelector(productsSelectors.selectAll);
  const {
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [filtersLoaded, dispatch]);

  if (!filtersLoaded) return <LoadingComponent message="Products loading..." />;

  return (
    <Grid container columnSpacing={4}>
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
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Catalog;
