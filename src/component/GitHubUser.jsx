import React, { useReducer } from "react";
import {
  TextField,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import axios from "axios";
import { HandleScreenReducer } from "../reducers/HandleScreenReducer";
import Typography from "@mui/material/Typography";

export default function GitHubUser() {
  const [userName, setUserName] = useState("");

  const [{ loading, error, data }, dispatch] = useReducer(HandleScreenReducer, {
    data: {},
    loading: false,
    error: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    getData();
  };

  const getData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const result = await axios.get(
        `https://api.github.com/users/${userName}`
      );
      dispatch({
        type: "FETCH_REQUEST_SUCCESS",
        payload: result.data,
      });
      console.log(data);
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: err.message });
    }
  };

  console.log(data);
  return (
    <div>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          id="user_name"
          label="GitHub User"
          type="string"
          variant="outlined"
          size="small"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <IconButton type="submit" sx={{ ml: 2 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 8 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Container
            fixed
            sx={{
              border: 1,
              boxShadow: 1,
              pb: 2,
            }}
          >
            <Box>
              <Grid container alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Avatar
                    alt="Remy Sharp"
                    src={data.avatar_url}
                    sx={{
                      width: {
                        xs: 100,
                        sm: 150,
                        md: 200,
                      },
                      height: {
                        xs: 100,
                        sm: 150,
                        md: 200,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography variant="h4" sx={{ textAlign: "left", ml: 6 }}>
                    {data.login}
                  </Typography>
                </Grid>
              </Grid>

              {/* <Grid item xs={4}>
                <h1 style={{ background: "red" }}>xs=4</h1>
              </Grid>
              <Grid item xs={8}>
                <h1 style={{ background: "green" }}>xs=8</h1>
              </Grid> */}
            </Box>
          </Container>
        )}
      </Box>
    </div>
  );
}
