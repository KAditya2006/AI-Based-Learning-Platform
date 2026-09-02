import React from 'react';
import clsx from 'clsx';

export const TableContainer = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('table-container', className)} {...props}>{children}</div>
);

export const Table = ({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <table className={className} {...props}>{children}</table>
);

export const TableHead = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props}>{children}</thead>
);

export const TableBody = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props}>{children}</tbody>
);

export const TableRow = ({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={className} {...props}>{children}</tr>
);

export const TableHeader = ({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={className} {...props}>{children}</th>
);

export const TableCell = ({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={className} {...props}>{children}</td>
);
