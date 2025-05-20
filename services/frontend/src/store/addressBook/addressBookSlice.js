import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AddressBookApi from '../../api/addressBookApi';

const addressBookApi = new AddressBookApi();

export const fetchAddresses = createAsyncThunk(
  'addressBook/fetchAddresses',
  async () => {
    return await addressBookApi.fetchAddresses();
  }
);

export const addAddress = createAsyncThunk(
  'addressBook/addAddress',
  async (address) => {
    return await addressBookApi.addAddress(address);
  }
);

export const editAddress = createAsyncThunk(
  'addressBook/editAddress',
  async ({ id, address }) => {
    return await addressBookApi.editAddress(id, address);
  }
);

export const deleteAddress = createAsyncThunk(
  'addressBook/deleteAddress',
  async (id) => {
    await addressBookApi.deleteAddress(id);
    return id;
  }
);

export const setDefaultAddress = createAsyncThunk(
  'addressBook/setDefaultAddress',
  async (id) => {
    return await addressBookApi.setDefaultAddress(id);
  }
);

const addressBookSlice = createSlice({
  name: 'addressBook',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
    selectedAddress: null,
    defaultAddress: null,
  },
  reducers: {
    selectAddress(state, action) {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress(state) {
      state.selectedAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.defaultAddress =
          action.payload.find((a) => a.is_default) || null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (a) => a.id !== action.payload
        );
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((a) => ({
          ...a,
          is_default: a.id === action.payload.id,
        }));
        state.defaultAddress = action.payload;
      });
  },
});

export const { selectAddress, clearSelectedAddress } =
  addressBookSlice.actions;
export default addressBookSlice.reducer;
