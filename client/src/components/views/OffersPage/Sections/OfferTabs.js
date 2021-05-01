import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;


  return (
    <div
      key={props.mode + 'tab'}
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appB:{
      width: "50vw",
      margin: "auto"
  }
}));

export default function OfferTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const value = props.value;
  const setValue = props.setValue;



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root} key={props.mode}>
      <AppBar className={classes.appB} position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
            centered
          aria-label="full width tabs example"
        >
          {props.mode === 'buyer' && <Tab label="Pending" {...a11yProps(0)} />}
          <Tab label="Accepted" {...a11yProps(props.mode === 'buyer' ? 1 : 0)} />
          <Tab label="Rejected" {...a11yProps(props.mode === 'buyer' ? 2 : 1)} />
        </Tabs>
      </AppBar>
      {props.mode === 'buyer' ? 

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          {props.inTab(props.sOffers[0], "Pending", props.mode)}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {props.inTab(props.sOffers[1], "Accepted", props.mode)}
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          {props.inTab(props.sOffers[2], "Rejected", props.mode)}
        </TabPanel>
      </SwipeableViews>
    :
    <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          {props.inTab(props.sOffers[1], "Accepted", props.mode)}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {props.inTab(props.sOffers[2], "Rejected", props.mode)}
        </TabPanel>
      </SwipeableViews>
    }

    </div>
  );
}
