import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { personService } from '../services/api';
import './PersonList.css';

export default function PersonList() {
  const navigate = useNavigate();
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    name: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadPersons = async () => {
    try {
      setLoading(true);
      const data = await personService.getAll();
      setPersons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading persons:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar pessoas',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleDelete = (id, name) => {
    setDeleteConfirm({
      open: true,
      id,
      name,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await personService.delete(deleteConfirm.id);
      setSnackbar({
        open: true,
        message: 'Pessoa deletada com sucesso',
        severity: 'success',
      });
      setDeleteConfirm({ open: false, id: null, name: '' });
      loadPersons();
    } catch (error) {
      console.error('Error deleting person:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao deletar pessoa',
        severity: 'error',
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/persons/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate('/persons/new');
  };

  const handleRefresh = () => {
    loadPersons();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box className="person-list">
        <Box className="person-list__header">
          <h1 className="person-list__title">
            <GroupIcon className="person-list__icon" />
            Pessoas
          </h1>
          <Box className="person-list__controls">
            <Tooltip title="Atualizar agora">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleAddNew}
            >
              Nova Pessoa
            </Button>
          </Box>
        </Box>

        {loading && persons.length === 0 ? (
          <Box className="person-list__loading">
            <CircularProgress size={48} />
            <p>Carregando pessoas...</p>
          </Box>
        ) : persons.length === 0 ? (
          <Card className="person-list__empty" variant="outlined">
            <SentimentDissatisfiedIcon className="person-list__empty-icon" />
            <h2>Nenhuma pessoa cadastrada</h2>
            <p>Comece adicionando a primeira pessoa ao sistema.</p>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleAddNew}
            >
              Adicionar Pessoa
            </Button>
          </Card>
        ) : (
          <Card variant="outlined">
            <TableContainer>
              <Table className="person-list__table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>E-mail</TableCell>
                    <TableCell className="person-list__actions-header">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {persons.map((person) => (
                    <TableRow key={person.id} className="person-list__row">
                      <TableCell>{person.id}</TableCell>
                      <TableCell>
                        <strong>{person.name}</strong>
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${person.email}`} className="person-list__email">
                          {person.email}
                        </a>
                      </TableCell>
                      <TableCell className="person-list__actions">
                        <Tooltip title="Editar pessoa">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(person.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir pessoa">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(person.id, person.name)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        <Dialog
          open={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, id: null, name: '' })}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Deseja realmente deletar {deleteConfirm.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteConfirm({ open: false, id: null, name: '' })}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Deletar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
