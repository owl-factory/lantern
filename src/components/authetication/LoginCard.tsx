import { Box, Button, Card, CardContent, Grid, TextField } from "@material-ui/core";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

function LoginCard(props: any) {
  const classes = useStyles(props);

  return (
    <Card>
      <CardContent>
          <Button
            variant="contained"
            onClick={() => {props.setSession({"user": {isLoggedIn: true}});}}
          >
            Google Login
          </Button>

          <form noValidate>
            <TextField id="username" label="Username" variant="outlined" fullWidth margin="normal"/>
            <TextField id="password" label="Password" type="password" variant="outlined" fullWidth margin="normal"/>
            <br/><br/>
            <Box className={classes.floatCenter}>
              <Button variant="contained" type="submit" color="primary">Log In</Button>
            </Box><br/>
            <Button variant="text">Sign Up</Button>
            <Button variant="text">Forgot Password</Button>
        </form>

      </CardContent>
    </Card>
  );
}

// TODO - create a full style component for global styles
const useStyles = makeStyles((theme: Theme) => ({
  floatCenter: {
    display: "inline-block",
    textAlign: "center",
  },
}));

export default LoginCard;
