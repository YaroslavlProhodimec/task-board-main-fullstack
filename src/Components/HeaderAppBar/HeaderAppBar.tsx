import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../App/store";
import {RequestStatusType} from "../../App/App-reducer";
import Box from "@mui/material/Box";
import {AppBar, Avatar, Button, LinearProgress, Toolbar, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

export function HeaderAppBar() {
    let status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar style={{background:'skyblue'}} position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography   variant="h3" component="div" sx={{flexGrow: 1}}>THE MONEY TEAM</Typography>

                    <Avatar alt="Remy Sharp" src="/Assets/MyAvatar.jpg"/>
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
        </Box>
    );
}