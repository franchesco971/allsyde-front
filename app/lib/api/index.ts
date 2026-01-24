// Point d'entrée centralisé pour tous les services API
// Export de tous les services et utilitaires

// ====== AUTHENTIFICATION ======
export {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  hasAuthToken,
} from './auth.service';

export type {
  LoginCredentials,
  LoginResponse,
  CurrentUser,
} from './auth';

// ====== HTTP CLIENT ======
export {
  httpGet,
  httpPost,
  httpPut,
  httpPatch,
  httpDelete,
  httpUpload,
  extractHydraMembers,
  buildApiUrl,
  ApiError,
} from './http-client';

export type { HttpRequestOptions } from './http-client';

// ====== SITES ======
export {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
  getSiteTypes,
  getSiteType,
  createSiteType,
  getSitesByCity,
  getSitesByType,
  getSitesByStatus,
} from './sites.service';

// ====== PROVIDERS ======
export {
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  searchProviders,
} from './providers.service';

export type { Provider } from './providers.service';

// ====== CONTRACTS ======
export {
  getContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  getContractsBySite,
  getContractsByProvider,
  getActiveContracts,
} from './contracts.service';

export type { Contract } from './contracts.service';

// ====== RESERVATIONS ======
export {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  patchReservation,
  deleteReservation,
  getReservationsBySite,
  getReservationsByStatus,
  getOpenReservations,
  closeReservation,
} from './reservations.service';

export type { Reservation } from './reservations.service';

// ====== PROOFS ======
export {
  getProofs,
  getProof,
  uploadProof,
  deleteProof,
  getProofUrl,
} from './proofs.service';

export type { Proof } from './proofs.service';

// ====== SEVERITIES ======
export {
  getSeverities,
  getSeverity,
  createSeverity,
  updateSeverity,
  deleteSeverity,
  getSeverityByCode,
  getSeveritiesByPriority,
} from './severities.service';

export type { Severity } from './severities.service';

// ====== RESERVATION TYPES ======
export {
  getReservationTypes,
  getReservationType,
  createReservationType,
  updateReservationType,
  deleteReservationType,
  getReservationTypeByCode,
} from './reservation-types.service';

export type { ReservationType } from './reservation-types.service';

// ====== USERS ======
export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  getUsersByRole,
  getAdmins,
  getManagers,
  getProviderUsers,
} from './users.service';

export type { User } from './users.service';
