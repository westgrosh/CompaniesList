import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import {useQuery} from "react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const EnterpriseList = ({data, onEnterpriseSelect, selectedEnterprise, refetchFn}) => {
    const [enterprises, setEnterprises] = useState([]);
    const [editingEnterprise, setEditingEnterprise] = useState(null);
    const [newEnterpriseName, setNewEnterpriseName] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // Состояние для модального окна

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Функция для сортировки предприятий
    const sortEnterprises = () => {
        setEnterprises(
            enterprises.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            })
        );
    };

    // Обновляем сотрудников, когда данные получены
    useEffect(() => {
        if (data) {
            // Сортируем сразу после получения данных
            setEnterprises(data.sort((a, b) => a.name.localeCompare(b.name)));
        }
    }, [data]);

    // Функции для работы с данными (создать, обновить, удалить)

    const handleNewEnterpriseChange = (event) => {
        setNewEnterpriseName(event.target.value);
    };

    const createEnterprise = async () => {
        if (newEnterpriseName.trim() === '') {
            // Поле пустое, покажите сообщение об ошибке
            alert('Пожалуйста, введите название предприятия.');
            return; // Прекращаем выполнение функции
        }

        try {
            const response = await axios.post('./api/enterprises', { name: newEnterpriseName });
            setNewEnterpriseName('');
            refetchFn(); // Обновляем данные после создания
        } catch (error) {
            console.error('Ошибка создания предприятия:', error);
            // Обработайте ошибку, например, отобразите уведомление пользователю
        }
    };

    // Функция для обновления editingEnterprise при изменении названия в TextField
    const handleEditChange = (event) => {
        setEditingEnterprise({
            ...editingEnterprise, // Копируем существующие свойства editingEnterprise
            name: event.target.value // Обновляем свойство name новым значением
        });
    };

    const updateEnterprise = async (id) => {
        try {
            await axios.put(`./api/enterprises/${id}`, editingEnterprise);
            const updatedEnterprises = enterprises.map((enterprise) =>
                enterprise.id === id ? editingEnterprise : enterprise
            );
            setEnterprises(updatedEnterprises);
            setEditingEnterprise(null);
            refetchFn(); // Обновляем данные после обновления
        } catch (error) {
            console.error('Ошибка обновления предприятия:', error);
            // Обработайте ошибку, например, отобразите уведомление пользователю
        }
    };

    const handleEditClick = (enterprise) => {
        setEditingEnterprise(enterprise);
    };

    const handleCancelEdit = () => {
        setEditingEnterprise(null);
    };

    const handleDeleteEnterprise = (enterpriseId) => {
        if (window.confirm(`Вы уверены, что хотите удалить предприятие ${enterprises.find(e => e.id === enterpriseId)?.name} ?`)) {
            // 1. Снимаем выделение
            onEnterpriseSelect(null);

            axios.delete(`./api/enterprises/${enterpriseId}`)
                .then(() => {
                    // 2. Обновляем данные после удаления
                    refetchFn();
                    // 3. Обновляем локальное состояние (enterprises) в EnterpriseList
                    setEnterprises(prevEnterprises => prevEnterprises.filter(e => e.id !== enterpriseId));
                })
                .catch((error) => {
                    if (error.response.data.status == 500){
                        alert(error.response.data.message)
                    }
                    console.error('Ошибка при удалении предприятия:', error);
                });
        }
    };

    const handleEditEnterprise = (enterpriseId) => {
        setEditingEnterprise(enterprises.find(e => e.id === enterpriseId));
        handleOpenDialog(); // Открываем диалог
    };

    const handleSaveEdit = (enterpriseId) => {
        // Обновляем предприятие в списке
        const updatedEnterprises = enterprises.map(e =>
            e.id === enterpriseId ? editingEnterprise : e
        );

        // Обновляем данные на сервере
        axios.put(`./api/enterprises/${enterpriseId}`, editingEnterprise)
            .then(() => {
                setEnterprises(updatedEnterprises);
                setEditingEnterprise(null);
                refetchFn();
                setOpenDialog(false);
            })
            .catch(error => {
                console.error('Ошибка при сохранении изменений:', error);
                // Обработайте ошибку, например, отобразите уведомление пользователю
            });
    };

    return (
        <>
            <Grid container justifyContent="space-between" marginTop="5px">
                <TextField
                    type="text"
                    value={newEnterpriseName}
                    onChange={handleNewEnterpriseChange}
                    placeholder="Название предприятия"
                    required
                />
                <Button variant="contained" onClick={createEnterprise} sx={{mt: 2}}>
                    Добавить предприятие
                </Button>
            </Grid>
            <List sx={{width: '100%'}}>
                {enterprises.map((enterprise) => (
                    <ListItem key={enterprise.id} disablePadding>
                        <ListItemButton
                            onClick={() => onEnterpriseSelect(enterprise)}
                            sx={{
                                ...(selectedEnterprise?.id === enterprise.id && {
                                    bgcolor: 'lightgray',
                                    color: 'black',
                                }),
                            }}
                        >
                            <ListItemText
                                primary={enterprise.name}
                                secondary={`(${enterprise.employees.length} сотрудников)`}
                            />
                        </ListItemButton>
                        {/* Кнопки для редактирования и удаления */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Изменить">
                                <IconButton onClick={() => {
                                    handleEditEnterprise(enterprise.id); // Устанавливаем enterprise для редактирования
                                }}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                                <IconButton onClick={() => handleDeleteEnterprise(enterprise.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </ListItem>
                ))}
            </List>
            {/* Модальное окно для редактирования */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Редактировать предприятие</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        id="name"
                        label="Название"
                        type="text"
                        value={editingEnterprise?.name || ''} // Используем значение editingEnterprise.name
                        onChange={handleEditChange} // Вызываем handleEditChange для обновления editingEnterprise
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={() => handleSaveEdit(editingEnterprise?.id)}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EnterpriseList;