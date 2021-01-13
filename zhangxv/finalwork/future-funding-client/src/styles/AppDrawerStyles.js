import grey from "@material-ui/core/colors/grey";

const styles = (theme) => ({
    appName: {
        margin: theme.spacing(1,2,1,3),
        fontWeight: 800,
        color: grey[700],
    },
    listIcons: {
        margin: theme.spacing(0, 1, 0, 1),
    },
    drawerList: {
        margin: theme.spacing(1),
    }
})

export default styles;