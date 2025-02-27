import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import menu_data from "../../../data/home-data/MenuData";

const NavMenu = ({ setLoginModal }: any) => {
    const [navClick, setNavClick] = useState<any>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [navClick]);

    const handleMyListingsClick = (e: any) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setLoginModal(true);
        } else {
            navigate("/dashboard/properties-list");
        }
    };

    return (
        <ul className="navbar-nav align-items-lg-center">
            <li className="d-block d-lg-none">
                <div className="logo">
                    <Link to="/" className="d-block">
                        <img src="/assets/images/logo/logo_01.svg" alt="" />
                    </Link>
                </div>
            </li>
            {menu_data.map((menu) => {
                // Direct navigation link: First item or provided link
                const navigateTo = menu.title === "My Listings"
                    ? "#" // Placeholder, will be handled by onClick
                    : (menu.has_dropdown && menu.sub_menus
                        ? menu.sub_menus[0]?.link || menu.link
                        : menu.link);

                return (
                    <li key={menu.id} className="nav-item">
                        <Link
                            onClick={(e) => {
                                setNavClick(!navClick);
                                if (menu.title === "My Listings") {
                                    handleMyListingsClick(e);
                                }
                            }}
                            to={navigateTo}
                            className="nav-link"
                        >
                            {menu.title}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default NavMenu;
