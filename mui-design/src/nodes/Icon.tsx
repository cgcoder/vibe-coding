import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type IconProps = {
    name: string;
    [key: string]: any; // Allow passing additional props to the icon
};

const iconMap: Record<string, React.ElementType> = {
    home: HomeIcon,
    search: SearchIcon,
    settings: SettingsIcon,
    person: PersonIcon,
};

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
    const IconComponent = iconMap[name.toLowerCase()] || HelpOutlineIcon;
    return <IconComponent {...props} />;
};

export default Icon;