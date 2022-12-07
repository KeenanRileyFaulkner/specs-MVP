import {RiContactsBook2Fill as ContactIcon, RiMenuFill as HamburgerMenuIcon} from 'react-icons/ri'
import {BsGrid as ProjectIcon} from 'react-icons/bs'
import { IoClose as CloseIcon, IoCreate as CreateIcon } from 'react-icons/io5'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdPhotos as PhotoIcon } from 'react-icons/io'
import { FaUserCircle as UserIcon } from 'react-icons/fa'

const Header = () => {
    return (
        <div className="header-container">
            <Link to='/home'>
                <NameTooltip  name={<h1>Photo Mosaic Generator</h1>} text={'Home Page'} />
            </Link>

            <div className='flex flex-row items-center ml-auto right-side-nav-icons mr-[40px]'>
                <Link to='/photos'>
                    <IconTooltip icon={<PhotoIcon/>} text="Photos" />
                </Link>
                <Link to='/projects-view'>
                    <IconTooltip icon={<ProjectIcon/>} text="View Projects" />
                </Link>
                <Link to='/project-creation'>
                    <IconTooltip icon={<CreateIcon/>} text="New Project" />
                </Link>
                <Link to='/account'>
                    <IconTooltip icon={ <UserIcon />} text="Account" />
                </Link>
            </div>
            <HamburgerMenu />
        </div>
    )
}

const NameTooltip = ({ name, text }) => {
    return(
        <div className='nav-icon z-10 group'>
            {name}

            <span className='nav-name-tooltip group-hover:scale-100'>
                {text}
            </span>
        </div>
    )
}

const IconTooltip = ({ icon, text }) => {
    return(
        <div className='nav-icon group'>
            {icon}

            <span className='nav-icon-tooltip group-hover:scale-100'>
                {text}
            </span>
        </div>
    )
}

const HamburgerMenu = () => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    let icon;
    let description;
    if (expanded) {
        icon = <CloseIcon onClick={toggleExpanded} />;
        description = 'Close Menu';
    } else {
        icon = <HamburgerMenuIcon onClick={toggleExpanded} />;
        description = 'Menu';
    }

    return (
        <div className='menu-toggle-btn'>
            <HamburgerMenuToolTip icon={icon} text={description} expanded={expanded} />
            <MenuDropdown expanded={expanded} toggleExpanded={toggleExpanded} />
        </div>
    )
}

const HamburgerMenuToolTip = ({ icon, text, expanded }) => {
    let expandedClass;
    expanded ? expandedClass='nav-menu-close-tooltip' : expandedClass = 'nav-menu-open-tooltip';

    return(
        <div className='nav-icon group'>
            {icon}

            <span className={`${expandedClass} group-hover:scale-100`}>
                {text}
            </span>
        </div>
    );
}

const MenuDropdown = ({ expanded, toggleExpanded }) => {
    let scale;
    if(expanded) {
        scale = 'scale-100'
    } else {
        scale = 'scale-0'
    }


    let navigate = useNavigate();
    const navToSkills = () => {
        navigate('/photos');
        toggleExpanded();
    }

    const navToProjects = () => {
        navigate('/projects');
        toggleExpanded();
    }
    
    const navToContact = () => {
        navigate('/contact');
        toggleExpanded();
    }

    const navToGithub = () => {
        navigate('/account');
        toggleExpanded();
    }

    return (
        <div className={`menu-dropdown-container ${scale} transition-all duration-200 origin-top-right`}>
            <button className='dropdown-btn' onClick={navToSkills}>Photos -- 📷</button>
            <hr className='dropdown-hr'/>
            <button className='dropdown-btn' onClick={navToProjects}>View Projects -- 👷</button>
            <hr className='dropdown-hr'/>
            <button className='dropdown-btn' onClick={navToContact}>New Project -- ✏️</button>
            <hr className='dropdown-hr'/>
            <button className='dropdown-btn' onClick={navToGithub}>Account -- 👤</button>
        </div>
    )
}

export default Header;