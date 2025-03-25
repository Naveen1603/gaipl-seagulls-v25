import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import Link from 'next/link';

const statusMap = {
  inProgress: { label: 'In-progress', color: 'warning' },
  closed: { label: 'Closed', color: 'success' },
  toDo: { label: 'To-Do', color: 'error' },
} as const;

const priorityMap = {
  low: { label: 'Low', color: 'warning' },
  medium: { label: 'Medium', color: 'success' },
  high: { label: 'High', color: 'error' },
} as const;

export interface Order {
  id: string;
  shortDescription: string;
  AppName: string;
  status: 'toDo' | 'inProgress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface LatestIncidentsProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestIncidents({ orders = [], sx }: LatestIncidentsProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Incident Status" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Incident Number</TableCell>
              <TableCell>Short description</TableCell>
              <TableCell>App Name</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order.id}>
                  <TableCell><Link href={`/dashboard/incidents/${order.id}`} passHref>
                  {order.id}
                  </Link></TableCell>
                  <TableCell>{order.shortDescription}</TableCell>
                  <TableCell>{order.AppName}</TableCell>
                  <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{order.priority}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {/* <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button> */}
      </CardActions>
    </Card>
  );
}
