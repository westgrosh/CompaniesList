import React, {useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import {useQueryClient} from "react-query";
import {Button, Grid, TextField, Typography} from "@mui/material";

const EmployeeForm = ({
                          isAddingEmployee,
                          setIsAddingEmployee,
                          isEditingEmployee,
                          setIsEditingEmployee,
                          editingEmployeeId,
                          setEditingEmployeeId,
                          newEmployeeData,
                          setNewEmployeeData,
                          employees,
                          setEmployees,
                          refetchFn
                      }) => {

    const handleNewEmployeeDataChange = (event) => {
        setNewEmployeeData({
            ...newEmployeeData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSaveEmployee = () => {
        if (isAddingEmployee) {
            axios.post('./api/employees', newEmployeeData)
                .then(response => {
                    setEmployees([...employees, response.data]);
                    setIsAddingEmployee(false);
                    refetchFn(); // !
                });
        } else if (isEditingEmployee) {
            axios.put(`./api/employees/${editingEmployeeId}`, newEmployeeData)
                .then(response => {
                    setEmployees(employees.map(e => (e.id === editingEmployeeId ? response.data : e)));
                    setIsEditingEmployee(false);
                    setEditingEmployeeId(null);
                });
        }
    };

    return (
        <Modal
            isOpen={isAddingEmployee || isEditingEmployee}
            onRequestClose={() => {
                setIsAddingEmployee(false);
                setIsEditingEmployee(false);
                setEditingEmployeeId(null);
            }}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                },
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography
                        variant="h5">{isAddingEmployee ? 'Добавить сотрудника' : 'Редактировать сотрудника'}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Имя"
                        id="firstName"
                        name="firstName"
                        value={newEmployeeData.firstName}
                        onChange={handleNewEmployeeDataChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Фамилия"
                        id="lastName"
                        name="lastName"
                        value={newEmployeeData.lastName}
                        onChange={handleNewEmployeeDataChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Должность"
                        id="post"
                        name="post"
                        value={newEmployeeData.post}
                        onChange={handleNewEmployeeDataChange}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent="space-between" marginTop="5px">
                <Grid item>
                    <Button variant="outlined" onClick={() => {
                        setIsAddingEmployee(false);
                        setIsEditingEmployee(false);
                        setEditingEmployeeId(null);
                    }}>Отмена</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={handleSaveEmployee}>Сохранить</Button>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default EmployeeForm;