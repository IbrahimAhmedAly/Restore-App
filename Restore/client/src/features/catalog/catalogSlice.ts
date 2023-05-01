import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

const getAxiosParams = (productParams: ProductParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy);
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);
  if (productParams.types)
    params.append("types", productParams.types.toString());
  if (productParams.brands)
    params.append("brand", productParams.brands.toString());
  return params;
};

export const fetchProductAsync = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("catalog/fetchProductAsync", async (_, thunckApi) => {
  const params = getAxiosParams(thunckApi.getState().catalog.productParams);
  try {
    const response = await agent.Catalog.list(params);
    thunckApi.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error) {
    console.log(error);
  }
});

export const fetchFilters = createAsyncThunk(
  "catalog/fetchFilters",
  async (_, thunckApi) => {
    try {
      return agent.Catalog.fetchFilters();
    } catch (error: any) {
      return thunckApi.rejectWithValue({ error: error.data });
    }
  }
);

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",
  };
}

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState<CatalogState>({
    productsLoaded: false,
    filtersLoaded: false,
    status: "idle",
    brands: [],
    types: [],
    productParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setPrdouctParams: (state, action) => {
      state.productsLoaded = false; // to load our products again
      state.productParams = { ...state.productParams, ...action.payload };
    },
    resetProductParams: (state) => {
      state.productParams = initParams();
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.filtersLoaded = true;
      state.status = "idle";
    });
    builder.addCase(fetchFilters.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const productsSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);

export const { setPrdouctParams, resetProductParams, setMetaData } =
  catalogSlice.actions;
