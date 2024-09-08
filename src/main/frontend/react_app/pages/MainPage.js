import React, {useState, useEffect} from 'react';
import {
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    TextField,
    Button,
    Box,
    Divider,
    Container,
} from "@mui/material";
import './main-page.css'
import EnterpriseList from '../components/EnterpriseList';
import EmployeeList from '../components/EmployeeList';
import {useQuery, useQueryClient} from "react-query";
import CustomLoading from "../components/loading/CustomLoading";


const MainPage = () => {

    const queryClient = useQueryClient();

    const [selectedEnterprise, setSelectedEnterprise] = useState(null);

    const fetchEnterprises = async () => {
        const response = await fetch('./api/enterprises');
        const data = await response.json();
        return data;
    };

    const {isLoading, error, data, refetch} = useQuery('enterprises', fetchEnterprises);

    const refetchData = () => {
        queryClient.invalidateQueries("enterprises");
        refetch();
    }


    if (isLoading) {
        return (
            <CustomLoading title={"Загрузка модуля"}></CustomLoading>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" component="h6" gutterBottom>
                <b>Ошибка получения списка предприятия: {error.message}</b>
            </Typography>
        );
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3} sx={{mt: 3}}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5">Список предприятий</Typography>
                    <EnterpriseList
                        data={data}
                        refetchFn={refetchData}
                        selectedEnterprise={selectedEnterprise}
                        onEnterpriseSelect={setSelectedEnterprise}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    {selectedEnterprise && (
                        <>
                            <Typography variant="h5">
                                Список сотрудников ({selectedEnterprise.name})
                            </Typography>
                            <EmployeeList
                                refetchFn = {refetchData}
                                selectedEnterprise={selectedEnterprise}
                            />
                        </>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default MainPage;