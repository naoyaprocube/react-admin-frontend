import React from 'react';
import { Edit, SimpleForm, TextInput, FileField, FileInput } from 'react-admin';
import { Typography } from '@mui/material';


const FilesEdit = (props:any) => {
    return (
        <Edit {...props} redirect='list'>
            <SimpleForm >
                <Typography variant="h6">
                    Downloading
                </Typography>
            </SimpleForm>
        </Edit>
    );
};

export default FilesEdit;