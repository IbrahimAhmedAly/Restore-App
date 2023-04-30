import { useEffect } from "react";
import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductAsync, productsSelectors } from "./catalogSlice";

const Catalog = () => {
  const products = useAppSelector(productsSelectors.selectAll);
  const { productsLoaded, status } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductAsync());
  }, [productsLoaded]);

  if (status.includes("pending"))
    return <LoadingComponent message="Products loading..." />;

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
