import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authCheck } from '../redux/authactionTypes';
import LoginPage from './Authentication/LoginPage';
import Home from './Body/Home';
import Logout from './Authentication/Logout';

const Main = () => {
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authCheck());
    }, [dispatch]);

    return (
        <Routes>
            <Route
                path="/login"
                element={token === null ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
                path="/"
                element={token ? <Home /> : <Navigate to="/login" />}
            />

            <Route path="/logout" element={<Logout />} />

        </Routes>
    );
};

export default Main;
