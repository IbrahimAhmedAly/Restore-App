import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

const ProductList = ({ products }: Props) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item md={4} sm={6} xs={12} key={product.id}>
          <ProductCard key={product.id} product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
