import React, {useEffect} from 'react';
import './App.css';
import {CircularProgress, Container} from "@mui/material";
import {TodoListsList} from "../Features/TodoListslist/TodoListsList";
import {ErrorSnackBar} from "../Components/ErrorSnackBar/ErrorSnackBar";
import {AppRootStateType} from "./store";
import {useSelector} from 'react-redux';
import {HeaderAppBar} from "../Components/HeaderAppBar/HeaderAppBar";
import {Routes, Route, Navigate} from "react-router-dom";
import { useDispatch } from 'react-redux';

function App() {
    const error = useSelector<AppRootStateType, string | null>(state => state.app.error)


    return (
        <div className="App">
            {error && <ErrorSnackBar error={error}/>}
            <HeaderAppBar/>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodoListsList/>} />
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
                    <Route path='*' element={<Navigate to={'/404'}/>} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;