import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import {Workbook, Worksheet} from 'xlsx/xlsx.js'; // импортируем из xlsx/xlsx.js
import axios from 'axios';
import './EmployeeList.css';
import EmployeeForm from "./EmployeeForm";
import {
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    IconButton,
    Box,
    Tooltip, Grid,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {useQuery} from "react-query";
import CustomLoading from "./loading/CustomLoading";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import moment from "moment";

const EmployeeList = ({
                          refetchFn,
                          selectedEnterprise
                      }) => {

    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [isAddingEmployee, setIsAddingEmployee] = useState(false);
    const [isEditingEmployee, setIsEditingEmployee] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);

    const [newEmployeeData, setNewEmployeeData] = useState({
        firstName: '',
        lastName: '',
        post: '',
        enterpriseId: '',
    });

    useEffect(() => {
        if (selectedEnterprise) {
            setNewEmployeeData({
                ...newEmployeeData,
                enterpriseId: selectedEnterprise ? selectedEnterprise.id : null
            });
        }

    }, [selectedEnterprise]);

    // Используем useQuery для загрузки сотрудников
    const {isLoading, error, data} = useQuery(
        ['employees', selectedEnterprise?.id],
        () => axios.get(`./api/employees/enterprises/${selectedEnterprise?.id}/employees`)
            .then(response => response.data)
    );

    // Обновляем сотрудников, когда данные получены
    useEffect(() => {
        if (data) {
            setEmployees(data);
        }
    }, [data]);

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Фильтр
    const filteredEmployees = searchTerm ?
        employees.filter(employee =>
            `${employee.firstName} ${employee.lastName} ${employee.post}`.toLowerCase().includes(searchTerm.toLowerCase())
        ) : employees;

    const handleAddEmployee = () => {
        setIsAddingEmployee(true);
        setNewEmployeeData({
            ...newEmployeeData,
            firstName: '',
            lastName: '',
            post: '',
        });
    };

    const handleReport = async () => {
        try {
            const response = await axios.get(`./api/employees/report/${selectedEnterprise.id}`, {
                responseType: 'blob' // Указываем, что хотим получить Blob
            });

            // Создаем URL-ссылку для скачивания
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Список сотрудников_' + moment(new Date()).format("DD/MM/YYYY") + '.xlsx'); // Имя файла для скачивания
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("Список сотрудников пуст");
                // Выведите сообщение пользователю, что список сотрудников пуст
            } else {
                alert("Ошибка при формировании отчета:", error);
                // Обработайте другие ошибки
            }
        }
    };

    const handleEditEmployee = (employeeId) => {
        setEditingEmployeeId(employeeId);
        const employee = employees.find(e => e.id === employeeId);
        setNewEmployeeData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            post: employee.post,
            enterpriseId: employee.enterprise.id, //
        });
        setIsEditingEmployee(true);
    };

    const handleDeleteEmployee = (employeeId) => {
        if (window.confirm(`Вы уверены, что хотите удалить сотрудника ${employees.find(e => e.id === employeeId).firstName} ${employees.find(e => e.id === employeeId).lastName}?`)) {
            axios.delete(`./api/employees/${employeeId}`)
                .then(() => {
                    setEmployees(employees.filter(e => e.id !== employeeId));
                    refetchFn(); //
                });
        }
    };

    if (isLoading) {
        return <CustomLoading title={"Загрузка списка..."}/>;
    }

    if (error) {
        return (
            <Typography variant="h6" component="h6" gutterBottom>
                <b>Ошибка получения списка: {error.message}</b>
            </Typography>
        );
    }

    return (
        <div>
            <TextField
                label="Поиск"
                value={searchTerm}
                onChange={handleSearchTermChange}
                fullWidth
                sx={{mb: 2}}
            />


            <List sx={{width: '100%'}}>
                {filteredEmployees.map((employee) => (
                    <ListItem key={employee.id} disablePadding>
                        <ListItemButton>
                            <ListItemText
                                primary={`${employee.firstName} ${employee.lastName}`}
                                secondary={employee.post}
                            />
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Tooltip title="Изменить">
                                    <IconButton
                                        onClick={() => {
                                            // Функция для реадактирования
                                            handleEditEmployee(employee.id)
                                        }}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Удалить">
                                    <IconButton
                                        onClick={() => {
                                            // Функция для удаления
                                            handleDeleteEmployee(employee.id);
                                        }}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>


            <Grid container justifyContent="space-between" marginTop="5px">
                <Button
                    variant="contained"
                    onClick={handleAddEmployee}
                    sx={{mt: 2}}
                >
                    Добавить сотрудника
                </Button>

                <Button
                    variant="contained"
                    onClick={handleReport}
                    sx={{mt: 2}}
                >
                    Сформировать отчет
                </Button>
            </Grid>

            <EmployeeForm // Используем EmployeeForm
                isAddingEmployee={isAddingEmployee}
                setIsAddingEmployee={setIsAddingEmployee}
                isEditingEmployee={isEditingEmployee}
                setIsEditingEmployee={setIsEditingEmployee}
                editingEmployeeId={editingEmployeeId}
                setEditingEmployeeId={setEditingEmployeeId}
                newEmployeeData={newEmployeeData}
                setNewEmployeeData={setNewEmployeeData}
                employees={employees}
                setEmployees={setEmployees}
                refetchFn={refetchFn}
            />


        </div>
    );
};

export default EmployeeList;