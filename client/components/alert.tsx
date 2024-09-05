import React from "react";
import Alert from '@mui/material/Alert';

interface Props {
    message: string
    severity: boolean
}

const AlertPopup: React.FC<Props> = ({ message, severity }) => {
    return (
        <Alert className='fixed top-5 right-5 z-50' severity={severity ? "success" : "error"}>
            {message}
        </Alert>
    )
}

export default AlertPopup;