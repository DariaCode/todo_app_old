/* ----------------------------------------------------
React.js / Auth component

Updated: 03/13/2020
Author: Daria Vodzinskaia
Website: www.dariacode.dev
-------------------------------------------------------  */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../context/auth-context';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://dariacode.dev/">
                DariaCode
            </Link>{' '} {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    paper: {
        marginTop: theme.spacing(14),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    switch: {
        alignItems: 'center'
    },
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto'
    }
});

class AuthPage extends Component {
     state = {
         isLogin: true
     }

    //to add access to context data.
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }
    switchModeHandler = () => {
        this.setState(prevState => {
            return {
                isLogin: !prevState.isLogin
            };
        })
    }

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        console.log(email, password, typeof email, typeof password, this.emailEl.current.value);
        // length without spaces - trim()
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!){
                        createUser(userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                let showError = res.json();
                showError.then(val => console.log(val.errors[0].message));
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            console.log(resData);
            if (resData.data.login.token) {
                this
                    .context
                    .login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
            }
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline/>
                <Container component="main" maxWidth="xs">
                    {/* component="main"- default is "div" 
                    <CssBaseline/> */}
                    <div className={classes.paper}>
                        {/* CHANGE THE AVATAR FOR THE LOGO ICON */}
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {this.state.isLogin
                                ? "Login"
                                : "Signup"}
                        </Typography>
                        <form className={classes.form} onSubmit={this.submitHandler}>
                            {/* CHECK IF noValidate NEED*/}
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                inputRef={this.emailEl}/>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                type="password"
                                inputRef={this.passwordEl}/>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                {this.state.isLogin
                                    ? "Login"
                                    : "Signup"}
                            </Button>
                            <Grid container justify="center">
                                {/* <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid> */}
                                <Grid item>
                                    <Link
                                        className={classes.switch}
                                        onClick={this.switchModeHandler}
                                        variant="body2">
                                        {this.state.isLogin
                                            ? "Don't have an account? Signup"
                                            : "Already have an account? Login"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
                <footer className={classes.footer}>
                    <Container maxWidth="sm">
                        <Copyright/>
                    </Container>
                </footer>
            </div>
        );
    }
}

AuthPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AuthPage);