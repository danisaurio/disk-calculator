
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { login } from '../services/service';

const Login = () => {

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
    e.preventDefault();
    const tempData = new FormData(e.currentTarget);
    const parsedData = Object.fromEntries(tempData.entries()) as { email: string, password:string };
    const result = await login(parsedData);
    if (result) {
      console.log({result})
    }
  };

  return (
    <Stack style={{width: '100%', alignItems: 'center'}}>
      <form onSubmit={onSubmit} id="login-form" data-testid="login-form" style={{maxWidth: '40vw'}}>
        <Grid item xs={12}>
          <Typography variant="body1">
            E-mail:&nbsp;&nbsp;
          </Typography>
          <TextField name="email" type="email" required fullWidth inputProps={{"data-testid": "email-input"}}/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body1'>
            Password:&nbsp;&nbsp;
          </Typography>
          <TextField name="password" type="password" required fullWidth inputProps={{"data-testid": "password-input"}}/>
        </Grid>
        <Grid item xs={12} marginTop={"20px"} textAlign="right">
          <Button type="submit" variant='contained'>Enter</Button>
        </Grid>
      </form>
    </Stack>
  );
};

export default Login;
