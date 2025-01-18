import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

interface CustomSpinnerProps {
    visible: boolean;
    textContent?: string;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({ visible, textContent }) => {
    return (
        <Spinner
            visible={visible}
            textContent={textContent}
            textStyle={{ color: "#FF7423" }}
            overlayColor="rgba(0, 0, 0, 0.5)"
            size={100}
            color="#FF7423"
            animation="fade"
        />
    );
};

export default CustomSpinner;
