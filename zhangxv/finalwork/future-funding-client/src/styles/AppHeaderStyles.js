import grey from "@material-ui/core/colors/grey";
import blue from "@material-ui/core/colors/blue";

const styles = (theme) => ({
    appBar: {
        boxShadow: 'none',
        backgroundColor: "white",
    },
    menuIcon: {
        color: grey[700],
        marginRight: theme.spacing(5)
    },
    headerText: {
        flexGrow: 1,
        color: grey[700],
        fontWeight: 700,
    },
    accountIcon: {
        color: blue[700]
    }
})

export default styles;