import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <Container component={Paper} style={{ height: 400 }}>
        <Typography gutterBottom variant="h3">
          Oops - we could not find what your are looking for
        </Typography>
        <Divider />
        <Button component={Link} to={`/catalog`} fullWidth>
          Go back to the shop
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
