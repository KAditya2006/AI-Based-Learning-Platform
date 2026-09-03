import express from 'express';
import { 
  ORGANIZATIONS, 
  DEPARTMENTS_BY_ORG, 
  DESIGNATIONS_BY_DEPT, 
  FUNCTIONAL_ROLES_BY_DESIG,
  DEFAULT_DESIGNATIONS,
  DEFAULT_FUNCTIONAL_ROLES
} from '../data/organizationStructure';

const router = express.Router();

router.get('/organizations', (req, res) => {
  res.json({ success: true, data: ORGANIZATIONS });
});

router.get('/organizations/:orgId/departments', (req, res) => {
  const { orgId } = req.params;
  const departments = DEPARTMENTS_BY_ORG[orgId] || [];
  res.json({ success: true, data: departments });
});

router.get('/departments/:deptId/designations', (req, res) => {
  const { deptId } = req.params;
  const designations = DESIGNATIONS_BY_DEPT[deptId] || DEFAULT_DESIGNATIONS;
  res.json({ success: true, data: designations });
});

router.get('/designations/:desigId/roles', (req, res) => {
  const { desigId } = req.params;
  const roles = FUNCTIONAL_ROLES_BY_DESIG[desigId] || DEFAULT_FUNCTIONAL_ROLES;
  res.json({ success: true, data: roles });
});

export default router;
