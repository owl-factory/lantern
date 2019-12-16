import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const Theme = createMuiTheme({
  palette: {
    primary: {
      main: "#62172D",
    },
    secondary: {
      main: "#215d6c",
    },
    type: "dark",
  },
});

export default Theme;
