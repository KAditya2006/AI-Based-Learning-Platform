import React from 'react';
import clsx from 'clsx';
import styles from './Table.module.css';

export const TableContainer = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.container, className)} {...props}>{children}</div>
);

export const Table = ({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <table className={clsx(styles.table, className)} {...props}>{children}</table>
);

export const TableHead = ({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={className} {...props}>{children}</thead>
);

export const TableBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={className} {...props}>{children}</tbody>
);

export const TableRow = ({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={clsx(styles.tr, className)} {...props}>{children}</tr>
);

export const TableHeader = ({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
  <th className={clsx(styles.th, className)} {...props}>{children}</th>
);

export const TableCell = ({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
  <td className={clsx(styles.td, className)} {...props}>{children}</td>
);
