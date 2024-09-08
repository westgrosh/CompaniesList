import React, {useEffect} from "react";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import {AdminPage} from "../pages/AdminPage";
import {AboutPage} from "../pages/AboutPage";


const CustomMenu = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/", title: "Главная страница" },
        //{ path: "/admin", title: "Админ панель" },

    ];

    return (
        <div className="menu">
            <ul>
                {menuItems.map((item, index) =>
                    <li key={index} className={location.pathname === item.path ? "active" : ""}>
                        <Link to={item.path}>{item.title}</Link>
                    </li>
                )}
                <br/><br/><br/>
                <li><a href="https://portal/cabinet/">Выйти из модуля</a></li>
            </ul>
        </div>
    )
}

export default CustomMenu;