import React, { useCallback, useEffect } from 'react';
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
import Book from '../../interfaces/Book';
import api from '../../services/api';

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
  const params = useParams<RouteParams>();

  const defaultValues = {
    title: '',
    isbn: '',
  };

  const schema = yup.object().shape({
    title: yup.string().required(),
    isbn: yup.string().required(),
  });

  const { control, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: Book) => {
    if (params.id) {
      const book = { ...data, id: Number(params.id) };
      await api.put(`/books/${params.id}`, book);
    } else {
      await api.post(`/books`, data);
    }
    history.push('/');
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
          };
          reset(bookValues);
        }
      });
    }
  }, [history, params.id, reset]);

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MenuBook />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add Book
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
                label="Title"
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
                Cancel
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
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default BookForm;
