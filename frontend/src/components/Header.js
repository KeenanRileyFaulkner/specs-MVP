import {RiStackFill as SkillsIcon, RiContactsBook2Fill as ContactIcon, RiMenuFill as HamburgerMenuIcon} from 'react-icons/ri'
import {BsGrid as ProjectIcon} from 'react-icons/bs'
import { IoClose as CloseIcon } from 'react-icons/io5'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
    return (
        <div className="header-container">
            <Link to='/about'>
                <NameTooltip  name={<h1>Keenan Faulkner</h1>} text={'About Page'} />
            </Link>

            <div className='flex flex-row items-center ml-auto right-side-nav-icons'>
                <Link to='/skills'>
                    <IconTooltip icon={<SkillsIcon/>} text="Skills" />
                </Link>
                <Link to='/projects'>
                    <IconTooltip icon={<ProjectIcon/>} text="Projects" />
                </Link>
                <Link to='/contact'>
                    <IconTooltip icon={<ContactIcon/>} text="Contact" />
                </Link>
                
                <IconTooltip 
                    icon={ 
                        <a href='https://github.com/KeenanRileyFaulkner' target='_blank' rel='noreferrer'>
                            <div className='profile-icon'/>
                        </a>
                    }
                    text="Github Profile"
                />
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
        navigate('/skills');
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

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener, noreferrer');
    }

    const navToGithub = () => {
        openInNewTab('https://github.com/KeenanRileyFaulkner');
        toggleExpanded();
    }

    return (
        <div className={`menu-dropdown-container ${scale} transition-all duration-200 origin-top-right`}>
            <button className='dropdown-btn' onClick={navToSkills}>Skills -- 🔨</button>
            <hr className='dropdown-hr'/>
            <button className='dropdown-btn' onClick={navToProjects}>Projects -- 👷</button>
            <hr className='dropdown-hr'/>
            <button className='dropdown-btn' onClick={navToContact}>Contact -- 📨</button>
            <hr className='dropdown-hr'/>
            <button className='dropdown-btn' onClick={navToGithub}>Github Profile -- 🖥️</button>
        </div>
    )
}

export default Header;