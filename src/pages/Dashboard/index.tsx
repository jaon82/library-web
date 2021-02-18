import React, { useCallback, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import Book from '../../interfaces/Book';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [books, setBooks] = useState<Book[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [bookToRemove, setBookToRemove] = useState(0);

  useEffect(() => {
    api.get<Book[]>('/books').then(response => setBooks(response.data));
  }, []);

  const deleteBook = useCallback((title: string, id: number) => {
    setBookToRemove(id);
    setDialogText(`Do you want to remove the book ${title}?`);
    setDialogOpen(true);
  }, []);

  const dialogClose = () => {
    setDialogOpen(false);
  };

  const dialogConfirm = async () => {
    setDialogOpen(false);
    await api.delete(`/books/${bookToRemove}`);
    setBooks(state => state.filter(book => book.id !== bookToRemove));
  };

  const sortBooksByISBN = (a: Book, b: Book) => {
    return (a.isbn || '').localeCompare(b.isbn || '');
  };

  return (
    <>
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
            onClick: (event, rowData: any) =>
              history.push(`/book/${rowData.id}`),
          },
        ]}
        localization={{ header: { actions: '' } }}
      />
      <ConfirmationDialog
        open={dialogOpen}
        close={dialogClose}
        confirm={dialogConfirm}
        title="Remove book?"
        text={dialogText}
      />
    </>
  );
};

export default Dashboard;
