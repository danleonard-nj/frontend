const tableColumns = [
  {
    field: 'entry_date',
    headerName: 'Date',
    width: 200,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 200,
  },
  {
    field: 'unit',
    headerName: 'Unit',
    width: 200,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 200,
  },
  {
    field: 'note',
    headerName: 'Note',
    width: 200,
  },
];

const transformJournalData = (entries, categories, units) => {
  return entries.map((entry) => {
    const category = categories.find(
      (x) => x.category_id === entry.category_id
    );

    const unit = units.find((x) => x.unit_id === entry.unit_id);

    return {
      ...entry,
      id: entry.entry_id,
      category: category?.category_name ?? 'N/A',
      unit: unit?.unit_name ?? 'N/A',
    };
  });
};

export { tableColumns, transformJournalData };
