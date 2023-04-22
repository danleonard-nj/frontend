import { Add } from '@mui/icons-material';
import {
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollable } from '../../../api/helpers/formattingHelpers';
import {
  createSceneCategory,
  getCategories,
} from '../../../store/kasa/actions/sceneActions';
import {
  setNewSceneCategoryToggle,
  setSelectedSceneCategory,
} from '../../../store/kasa/sceneSlice';
import { KasaSceneCategoryListActions } from './KasaSceneCategoryListActions';
import Spinner from '../../Spinner';

const KasaSceneCategoryList = () => {
  const dispatch = useDispatch();

  const [newCategoryName, setNewCategoryName] = useState('');

  const { newSceneCategoryToggle, sceneCategories, scenesLoading } =
    useSelector((x) => x.scene);

  const handleSelectSceneCategory = (categoryId) => {
    dispatch(setSelectedSceneCategory(categoryId));
  };

  const handleNewCategory = () => {
    setNewSceneCategoryToggle(false);
    dispatch(createSceneCategory(newCategoryName));
    dispatch(getCategories());
  };

  return scenesLoading ? (
    <Container>
      <Spinner />
    </Container>
  ) : (
    <Paper elevation={4} sx={{ padding: 1, m: 1 }}>
      <Grid container>
        <Grid item lg={12}>
          <List sx={scrollable} dense>
            {sceneCategories.map((item) => (
              <ListItem
                secondaryAction={
                  <KasaSceneCategoryListActions item={item} />
                }>
                <ListItemButton
                  key={item?.scene_category_id}
                  onClick={() =>
                    handleSelectSceneCategory(item?.scene_category_id)
                  }>
                  <ListItemText primary={item.scene_category} />
                </ListItemButton>
              </ListItem>
            ))}
            {newSceneCategoryToggle && (
              <ListItem>
                <Box display='flex'>
                  <TextField
                    variant='standard'
                    fullWidth
                    onChange={(event) =>
                      setNewCategoryName(event.target.value)
                    }
                  />
                  <IconButton onClick={() => handleNewCategory()}>
                    <Add />
                  </IconButton>
                </Box>
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { KasaSceneCategoryList };
