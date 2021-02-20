import React, { useCallback, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useLoader } from '../../hooks/loader';
import { useToast } from '../../hooks/toast';
import Author from '../../interfaces/Author';
import TableHelper from '../../helpers/TableHelper';

const Authors: React.FC = () => {
  const history = useHistory();
  const { showLoader, hideLoader } = useLoader();
  const { addToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorToRemove, setAuthorToRemove] = useState(0);

  useEffect(() => {
    showLoader();
    api
      .get<Author[]>('/authors')
      .then(response => {
        setAuthors(response.data);
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

  const deleteAuthor = useCallback((title: string, id: number) => {
    setAuthorToRemove(id);
    setDialogText(`Deseja remover o autor ${title}?`);
    setDialogOpen(true);
  }, []);

  const dialogClose = () => {
    setDialogOpen(false);
  };

  const dialogConfirm = async () => {
    try {
      setDialogOpen(false);
      showLoader();
      const response = await api.get(`/authors/${authorToRemove}/books`);
      if (response.data.length > 0) {
        addToast({
          type: 'error',
          title: 'Operação não autorizada',
          description: 'Autor possui livros associados.',
        });
      } else {
        await api.delete(`/authors/${authorToRemove}`);
        setAuthors(state =>
          state.filter(author => author.id !== authorToRemove),
        );
        addToast({
          type: 'success',
          title: 'Exclusão realizada!',
          description: 'Autor excluído com sucesso',
        });
      }
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Erro na requisição',
        description: 'Ocorreu um erro ao excluir o autor, tente novamente.',
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <MaterialTable
        title="Autores"
        columns={[
          {
            title: 'Nome',
            field: 'firstName',
            customSort: (a, b) => a.firstName.localeCompare(b.firstName),
          },
          {
            title: 'Sobrenome',
            field: 'lastName',
            customSort: (a, b) => a.lastName.localeCompare(b.lastName),
          },
        ]}
        data={authors}
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
            tooltip: 'Adicionar',
            isFreeAction: true,
            onClick: () => history.push('/author'),
          },
          {
            icon: 'delete',
            tooltip: 'Excluir',
            onClick: (event, rowData: any) =>
              deleteAuthor(
                `${rowData.firstName} ${rowData.lastName}`,
                rowData.id,
              ),
          },
          {
            icon: 'edit',
            tooltip: 'Editar',
            onClick: (event, rowData: any) =>
              history.push(`/author/${rowData.id}`),
          },
        ]}
        localization={TableHelper.localization}
      />
      <ConfirmationDialog
        open={dialogOpen}
        close={dialogClose}
        confirm={dialogConfirm}
        title="Remover autor?"
        text={dialogText}
      />
    </>
  );
};

export default Authors;
