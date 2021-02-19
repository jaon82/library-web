import React, { useCallback, useEffect, useMemo } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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

const AuthorForm: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { showLoader, hideLoader } = useLoader();
  const { addToast } = useToast();
  const params = useParams<RouteParams>();

  const defaultValues = {
    firstName: '',
    lastName: '',
  };

  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  });

  const { control, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: Author) => {
    try {
      showLoader();
      if (params.id) {
        const author = { ...data, id: Number(params.id) };
        await api.put(`/authors/${params.id}`, author);
        addToast({
          type: 'success',
          title: 'Edição realizada!',
          description: 'Autor alterado com sucesso',
        });
      } else {
        await api.post(`/authors`, data);
        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Autor cadastrado com sucesso',
        });
      }
      history.push('/authors');
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
    history.push('/authors');
  }, [history]);

  useEffect(() => {
    if (params.id) {
      api.get<Author>(`/authors/${params.id}`).then(response => {
        const author = response.data;
        if (!author) {
          history.push('/authors');
        } else {
          const authorValues = {
            id: author.id,
            firstName: author.firstName,
            lastName: author.lastName,
          };
          reset(authorValues);
        }
      });
    }
  }, [history, params.id, reset]);

  const formTitle = useMemo(() => {
    let title = 'Adicionar Autor';
    if ('id' in params) {
      title = 'Editar Autor';
    }
    return title;
  }, [params]);

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LocalLibrary />
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
                name="firstName"
                control={control}
                label="Nome"
                variant="outlined"
                fullWidth
                autoFocus
                required
                error={!!errors.firstName}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={<TextField />}
                name="lastName"
                control={control}
                variant="outlined"
                fullWidth
                label="Sobrenome"
                required
                error={!!errors.lastName}
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

export default AuthorForm;
