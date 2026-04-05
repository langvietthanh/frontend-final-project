import React from "react";
import { AppBar, Toolbar, Typography, Box, Checkbox, FormControlLabel } from "@mui/material";

import "./styles.css";

function TopBar ({contentTopBar, advancedFeatures, setAdvancedFeatures}) {
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Lăng Viết Thành - B23DCCN768
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {setAdvancedFeatures && (
              <FormControlLabel
                  control={
                      <Checkbox 
                          checked={advancedFeatures} 
                          onChange={(e) => setAdvancedFeatures(e.target.checked)} 
                          sx={{ color: "white", '&.Mui-checked': { color: "white" } }}
                      />
                  }
                  label={<Typography variant="body1" color="inherit">Enable Advanced Features</Typography>}
              />
          )}
          <Typography variant="h5" color="inherit">
            {contentTopBar}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
  
  export default TopBar;
  
