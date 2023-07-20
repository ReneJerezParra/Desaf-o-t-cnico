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
import TableRepos from "../utiles/tabla";

export default function GitHubUser() {
  const [userName, setUserName] = useState("");
  const [err, setErr] = useState({
    error: false,
    message: "",
  });

  const [{ loading, error, data }, dispatch] = useReducer(HandleScreenReducer, {
    data: {},
    loading: false,
    error: "",
  });

  const validateUserName = (userName) => {
    const regExp = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
    return regExp.test(userName);
  };
  const badRequest = (error) => {
    const regExp = /\b4\d{2}\b/;
    return regExp.test(error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateUserName(userName)) {
      setErr({
        error: true,
        message: "Incorrect GitHub user format",
      });
    } else {
      setErr({
        error: false,
        message: "",
      });
      getData();
    }
  };

  const getData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const result = await axios.get(
        `https://api.github.com/users/${userName}`
      );

      const list_repos_url = result.data.repos_url;
      const list_repos_response = await axios.get(list_repos_url);

      const updated_list_repos = list_repos_response.data.map((repo) => {
        const dateString = repo.created_at.slice(0, 10);
        return { ...repo, created_at: dateString };
      });

      result.data.list_repos = updated_list_repos;

      dispatch({
        type: "FETCH_REQUEST_SUCCESS",
        payload: result.data,
      });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: err.message });
    }
  };

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          id="user_name"
          label="GitHub User"
          type="string"
          variant="outlined"
          size="small"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          error={err.error}
          helperText={err.message}
        />
        <IconButton type="submit" sx={{ ml: 2 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 8 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Box>
            {badRequest(error) ? (
              <Alert severity="info">"This gitHub user does not exist"</Alert>
            ) : (
              <Alert severity="error">{error}</Alert>
            )}
          </Box>
        ) : Object.keys(data).length != 0 ? (
          <Container
            fixed
            sx={
              {
                // border: 1,
                // boxShadow: 1,
              }
            }
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
              <Grid container sx={{ textAlign: "left", mt: 4 }}>
                <Grid item xs={12} sm={3} md={2}>
                  <Typography variant="h5">Biography:</Typography>
                </Grid>
                <Grid
                  item
                  md={10}
                  sm={9}
                  sx={{ mt: 1, maxHeight: "150px", overflowY: "auto" }}
                >
                  <Typography sx={{ textAlign: "left" }}>{data.bio}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ textAlign: "left", mt: 4 }}>
                <Grid item sm={3}>
                  <Typography variant="h5">Number of followers:</Typography>
                </Grid>
                <Grid item sm={8}>
                  <Typography sx={{ textAlign: "left", mt: 1 }}>
                    {data.followers}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ textAlign: "left", mt: 4 }}>
                <Grid item sm={4}>
                  <Typography variant="h5">
                    Number of published repositories:
                  </Typography>
                </Grid>
                <Grid item sm={8}>
                  <Typography sx={{ textAlign: "left", mt: 1 }}>
                    {data.public_repos}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h5" sx={{ textAlign: "left", mt: 4 }}>
                List of repositories:
              </Typography>

              <TableRepos rows={data.list_repos} />
            </Box>
          </Container>
        ) : (
          <></>
        )}
      </Box>
    </div>
  );
}
