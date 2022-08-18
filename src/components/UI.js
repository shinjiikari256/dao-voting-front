export {
  Box,
  Paper,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  FormControlLabel,
  Select,
  Switch,
  Button,
  IconButton,
  Alert,
  Collapse,
  Typography,
  Chip,
} from '@mui/material';

export {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export { CloseIcon, ThumbUpIcon, ThumbDownIcon, DoneIcon, AddIcon  };


import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.success.main,
  },
  [`&.no-vote.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[500],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: theme.palette.error.main,
  },
  [`&.no-vote.${linearProgressClasses.colorPrimary}, &.no-vote .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.grey[500],
  },
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.grey[500],
  [`&.yes`]: {
    color: theme.palette.success.main,
  },
  [`&.no`]: {
    color: theme.palette.error.main,
  },
}));

export { BorderLinearProgress, ProgressLabel }