import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Card,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { personService } from '../services/api';
import './PersonForm.css';

export default function PersonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
  });

  useEffect(() => {
    if (isEdit) {
      loadPerson();
    }
  }, [id]);

  const loadPerson = async () => {
    try {
      setLoading(true);
      const person = await personService.getById(id);
      setFormData({
        name: person.name || '',
        email: person.email || '',
      });
    } catch (error) {
      console.error('Error loading person:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar pessoa',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';

    if (name === 'name') {
      if (!value.trim()) {
        error = 'Nome completo é obrigatório';
      } else if (value.length > 120) {
        error = 'Nome não pode ter mais de 120 caracteres';
      }
    }

    if (name === 'email') {
      if (!value.trim()) {
        error = 'E-mail é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'E-mail inválido';
      } else if (value.length > 180) {
        error = 'E-mail não pode ter mais de 180 caracteres';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await personService.update(id, formData);
        setSnackbar({
          open: true,
          message: 'Pessoa atualizada com sucesso',
          severity: 'success',
        });
      } else {
        await personService.create(formData);
        setSnackbar({
          open: true,
          message: 'Pessoa criada com sucesso',
          severity: 'success',
        });
      }

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('personRefresh'));
        navigate('/persons');
      }, 200);
    } catch (error) {
      console.error('Error saving person:', error);
      setSnackbar({
        open: true,
        message: isEdit ? 'Erro ao atualizar pessoa' : 'Erro ao criar pessoa',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/persons');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box className="person-form">
        <Box className="person-form__header">
          <h1 className="person-form__title">
            {isEdit ? (
              <EditIcon className="person-form__icon" />
            ) : (
              <PersonAddIcon className="person-form__icon" />
            )}
            {isEdit ? 'Editar' : 'Nova'} Pessoa
          </h1>
        </Box>

        <Card variant="outlined">
          {saving && <LinearProgress />}

          <Box sx={{ p: 3 }}>
            <form onSubmit={handleSubmit} className="person-form__form">
              <TextField
                fullWidth
                label="Nome completo"
                name="name"
                placeholder="Digite o nome completo"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                inputProps={{ maxLength: 120 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.name.length}/120
                    </InputAdornment>
                  ),
                }}
                disabled={saving}
                className="person-form__field"
              />

              <TextField
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                inputProps={{ maxLength: 180 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'action.active', mr: 1 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.email.length}/180
                    </InputAdornment>
                  ),
                }}
                disabled={saving}
                className="person-form__field"
              />

              <Box className="person-form__actions">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  type="submit"
                  disabled={saving || loading}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                  component="button"
                >
                  Cancelar
                </Button>
              </Box>
            </form>
          </Box>
        </Card>

        <Box className="person-form__help">
          <InfoIcon />
          <p>Preencha todos os campos obrigatórios para continuar.</p>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
