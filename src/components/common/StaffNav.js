import {
  FloatingMenu,
  MainButton,
  ChildButton,
} from 'react-floating-button-menu';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faXmark, faPlus, faUtensils} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {useNavigate} from "react-router-dom";


const StaffNav = () => {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
      <div style={{height: 'auto', width: 'auto', position: 'absolute', bottom: '20px', right: '15px'}}>
            <FloatingMenu
            slideSpeed={500}
            direction="up"
            spacing={8}
            isOpen={isOpen}
          >
            <MainButton
              iconResting={<FontAwesomeIcon icon={faPlus} style={{ fontSize: 20, color: 'white' }} />}
              iconActive={<FontAwesomeIcon icon={faXmark} style={{ fontSize: 20, color: 'white' }} />}
              onClick={() => setIsOpen(isOpen => !isOpen)}
              size={50}
              background={'#30419B'}
            />
             <ChildButton
              icon={<FontAwesomeIcon icon={faHome} style={{ fontSize: 13, color: 'white' }} />}
              size={40}
              background={'rgba(48, 65, 155, 0.8)'}
              onClick={() => {
                  navigate('/staff/dashboard')
              }}
            />
            <ChildButton
              icon={<FontAwesomeIcon icon={faUtensils} style={{ fontSize: 13, color: 'white' }} />}
              size={40}
              background={'rgba(48, 65, 155, 0.8)'}
              onClick={() => {
                  navigate('/staff/create-order')
              }}
            />


          </FloatingMenu>
      </div>
    )
}

export default StaffNav;