import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAddresses,
  addAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
  selectAddress,
  clearSelectedAddress,
} from '../../store/addressBook/addressBookSlice';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function AddressFormDialog({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(initialData || {});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {form.id ? 'Edit Address' : 'Add Address'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label='Label'
              name='label'
              value={form.label || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='First Name'
              name='first_name'
              value={form.first_name || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='Last Name'
              name='last_name'
              value={form.last_name || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Street Address'
              name='address_one'
              value={form.address_one || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='City'
              name='city_locality'
              value={form.city_locality || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='State'
              name='state_province'
              value={form.state_province || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='Zip Code'
              name='zip_code'
              value={form.zip_code || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='Phone'
              name='phone'
              value={form.phone || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AddressSelectPrompt({ open, onClose, onSelect }) {
  return (
    <Dialog open={open} onClose={() => onClose(null)}>
      <DialogTitle>Apply Address</DialogTitle>
      <DialogContent>
        <Typography>Send this address to:</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSelect('shipper')}>Shipper</Button>
        <Button onClick={() => onSelect('destination')}>
          Destination
        </Button>
        <Button onClick={() => onClose(null)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AddressBook({ onApplyAddress }) {
  const dispatch = useDispatch();
  const { addresses, loading, defaultAddress } = useSelector(
    (state) => state.addressBook
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [promptOpen, setPromptOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (address) => {
    setEditData(address);
    setFormOpen(true);
  };
  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
  };
  const handleSetDefault = (id) => {
    dispatch(setDefaultAddress(id));
  };
  const handleFormSave = (data) => {
    if (data.id) {
      dispatch(editAddress({ id: data.id, address: data })).then(
        () => {
          dispatch(fetchAddresses());
        }
      );
    } else {
      dispatch(addAddress(data)).then(() => {
        dispatch(fetchAddresses());
      });
    }
    setFormOpen(false);
  };
  const handleSelect = (address) => {
    setSelected(address);
    setPromptOpen(true);
  };
  const handlePromptSelect = (target) => {
    if (target && onApplyAddress) {
      onApplyAddress(selected, target);
    }
    setPromptOpen(false);
    setSelected(null);
  };

  return (
    <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'>
        <Grid item>
          <Typography variant='h6'>Address Book</Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' onClick={handleAdd}>
            Add Address
          </Button>
        </Grid>
      </Grid>
      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Default</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zip</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((address) => (
              <TableRow
                key={address.id}
                hover
                selected={
                  defaultAddress && address.id === defaultAddress.id
                }>
                <TableCell>
                  <IconButton
                    onClick={() => handleSetDefault(address.id)}>
                    {address.is_default ? (
                      <StarIcon color='primary' />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{address.label}</TableCell>
                <TableCell>
                  {address.first_name} {address.last_name}
                </TableCell>
                <TableCell>{address.address_one}</TableCell>
                <TableCell>{address.city_locality}</TableCell>
                <TableCell>{address.state_province}</TableCell>
                <TableCell>{address.zip_code}</TableCell>
                <TableCell>{address.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(address)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(address.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    size='small'
                    onClick={() => handleSelect(address)}>
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddressFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
        initialData={editData}
      />
      <AddressSelectPrompt
        open={promptOpen}
        onClose={handlePromptSelect}
        onSelect={handlePromptSelect}
      />
    </Paper>
  );
}
