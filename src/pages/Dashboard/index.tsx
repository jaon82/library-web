import React, { useCallback, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import Book from '../../interfaces/Book';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    api.get<Book[]>('/books').then(response => setBooks(response.data));
  }, []);

  const deleteBook = useCallback((title: string, id: number) => {
    console.log('remover');
  }, []);

  const sortBooksByISBN = (a: Book, b: Book) => {
    return (a.isbn || '').localeCompare(b.isbn || '');
  };

  return (
    <MaterialTable
      title="Books"
      columns={[
        {
          title: 'Title',
          field: 'title',
          customSort: (a, b) => a.title.localeCompare(b.title),
        },
        {
          title: 'ISBN',
          field: 'isbn',
          customSort: sortBooksByISBN,
        },
      ]}
      data={books}
      options={{
        sorting: true,
        search: false,
        filtering: true,
        actionsColumnIndex: -1,
        pageSize: 10,
        pageSizeOptions: [10],
      }}
      actions={[
        {
          icon: 'add',
          tooltip: 'Add Book',
          isFreeAction: true,
          onClick: () => history.push('/book'),
        },
        {
          icon: 'delete',
          tooltip: 'Delete',
          onClick: (event, rowData: any) =>
            deleteBook(rowData.title, rowData.id),
        },
        {
          icon: 'edit',
          tooltip: 'Edit',
          onClick: (event, rowData: any) => history.push(`/book/${rowData.id}`),
        },
      ]}
      localization={{ header: { actions: '' } }}
    />
  );
};

export default Dashboard;
