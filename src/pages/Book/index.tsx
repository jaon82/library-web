import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuBook from '@material-ui/icons/MenuBook';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Book from '../../interfaces/Book';
import api from '../../services/api';
import Author from '../../interfaces/Author';
import { useLoader } from '../../hooks/loader';
import { useToast } from '../../hooks/toast';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface RouteParams {
  id: string;
}

const BookForm: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { showLoader, hideLoader } = useLoader();
  const { addToast } = useToast();
  const params = useParams<RouteParams>();
  const [authors, setAuthors] = useState<Author[]>([]);

  const defaultValues = {
    title: '',
    isbn: '',
    authorId: 0,
  };

  const schema = yup.object().shape({
    title: yup.string().required(),
    isbn: yup.string().required(),
    authorId: yup.number().positive().required(),
  });

  const { control, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: Book) => {
    try {
      showLoader();
      if (params.id) {
        const book = { ...data, id: Number(params.id) };
        await api.put(`/books/${params.id}`, book);
        addToast({
          type: 'success',
          title: 'Edição realizada!',
          description: 'Livro alterado com sucesso',
        });
      } else {
        await api.post(`/books`, data);
        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Livro cadastrado com sucesso',
        });
      }
      history.push('/');
    } catch {
      addToast({
        type: 'error',
        title: 'Erro na requisição',
        description: 'Ocorreu um erro na requisição, tente novamente.',
      });
    } finally {
      hideLoader();
    }
  };

  const handleCancel = useCallback(() => {
    history.push('/');
  }, [history]);

  useEffect(() => {
    if (params.id) {
      api.get<Book>(`/books/${params.id}`).then(response => {
        const book = response.data;
        if (!book) {
          history.push('/');
        } else {
          const bookValues = {
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            authorId: Number(book.authorId),
          };
          reset(bookValues);
        }
      });
    }
  }, [history, params.id, reset]);

  const formTitle = useMemo(() => {
    let title = 'Adicionar Livro';
    if ('id' in params) {
      title = 'Editar Livro';
    }
    return title;
  }, [params]);

  useEffect(() => {
    showLoader();
    api
      .get<Author[]>(`/authors`)
      .then(response => {
        const authorsSorted = response.data.sort((a, b) => {
          return a.firstName.localeCompare(b.firstName);
        });
        setAuthors(authorsSorted);
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

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MenuBook />
        </Avatar>
        <Typography component="h1" variant="h5">
          {formTitle}
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                as={<TextField />}
                name="title"
                control={control}
                defaultValue=""
                label="Título"
                variant="outlined"
                fullWidth
                autoFocus
                required
                error={!!errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={<TextField />}
                name="isbn"
                control={control}
                defaultValue=""
                variant="outlined"
                fullWidth
                label="ISBN"
                required
                error={!!errors.isbn}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="authorId"
                control={control}
                render={props => (
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Autor</InputLabel>
                    <Select
                      error={!!errors.authorId}
                      required
                      label="Autor"
                      onChange={e => {
                        props.onChange(e.target.value);
                      }}
                      value={props.value}
                    >
                      <MenuItem value="0">
                        <em>None</em>
                      </MenuItem>
                      {authors.map(item => (
                        <MenuItem value={Number(item.id)} key={Number(item.id)}>
                          {`${item.id} - ${item.firstName} ${item.lastName}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default BookForm;
