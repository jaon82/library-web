import React, { useCallback, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import Book from '../../interfaces/Book';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useLoader } from '../../hooks/loader';
import { useToast } from '../../hooks/toast';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const { showLoader, hideLoader } = useLoader();
  const { addToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [bookToRemove, setBookToRemove] = useState(0);

  useEffect(() => {
    showLoader();
    api
      .get<Book[]>('/books')
      .then(response => {
        setBooks(response.data);
        hideLoader();
      })
      .catch(() => {
        addToast({
          type: 'error',
          title: 'Erro na requisição',
          description: 'Ocorreu um erro ao buscar os dados, tente novamente.',
        });
        hideLoader();
      });
  }, [addToast, hideLoader, showLoader]);

  const deleteBook = useCallback((title: string, id: number) => {
    setBookToRemove(id);
    setDialogText(`Do you want to remove the book ${title}?`);
    setDialogOpen(true);
  }, []);

  const dialogClose = () => {
    setDialogOpen(false);
  };

  const dialogConfirm = async () => {
    try {
      setDialogOpen(false);
      showLoader();
      await api.delete(`/books/${bookToRemove}`);
      setBooks(state => state.filter(book => book.id !== bookToRemove));
      addToast({
        type: 'success',
        title: 'Exclusão realizada!',
        description: 'Livro excluído com sucesso',
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Erro na requisição',
        description: 'Ocorreu um erro ao excluir o livro, tente novamente.',
      });
    } finally {
      hideLoader();
    }
  };

  const sortBooksByISBN = (a: Book, b: Book) => {
    return (a.isbn || '').localeCompare(b.isbn || '');
  };

  return (
    <>
      <MaterialTable
        title="Livros"
        columns={[
          {
            title: 'Título',
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
            tooltip: 'Adicionar Livro',
            isFreeAction: true,
            onClick: () => history.push('/book'),
          },
          {
            icon: 'delete',
            tooltip: 'Excluir',
            onClick: (event, rowData: any) =>
              deleteBook(rowData.title, rowData.id),
          },
          {
            icon: 'edit',
            tooltip: 'Editar',
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
        title="Remover livro?"
        text={dialogText}
      />
    </>
  );
};

export default Dashboard;
