// Service pour la gestion des Users (Utilisateurs)
// Opérations CRUD sur les utilisateurs

import { httpGet, httpPost, httpPut, httpPatch, httpDelete, extractHydraMembers } from './http-client';

export interface User {
  '@id': string;
  '@type': string;
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  site: string | null;
}

/**
 * Récupère tous les utilisateurs
 */
export async function getUsers(): Promise<User[]> {
  const response = await httpGet('/api/users');
  return extractHydraMembers<User>(response);
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUser(id: number): Promise<User> {
  return httpGet<User>(`/api/users/${id}`);
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUser(userData: Partial<User>): Promise<User> {
  return httpPost<User>('/api/users', userData);
}

/**
 * Met à jour un utilisateur (remplacement complet)
 */
export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  return httpPut<User>(`/api/users/${id}`, userData);
}

/**
 * Met à jour un utilisateur (modification partielle)
 */
export async function patchUser(id: number, userData: Partial<User>): Promise<User> {
  return httpPatch<User>(`/api/users/${id}`, userData);
}

/**
 * Supprime un utilisateur
 */
export async function deleteUser(id: number): Promise<void> {
  return httpDelete<void>(`/api/users/${id}`);
}

/**
 * Récupère les utilisateurs par rôle
 */
export async function getUsersByRole(role: string): Promise<User[]> {
  const users = await getUsers();
  return users.filter(user => user.roles.includes(role));
}

/**
 * Récupère les administrateurs
 */
export async function getAdmins(): Promise<User[]> {
  return getUsersByRole('ROLE_ADMIN');
}

/**
 * Récupère les managers
 */
export async function getManagers(): Promise<User[]> {
  return getUsersByRole('ROLE_MANAGER');
}

/**
 * Récupère les prestataires
 */
export async function getProviderUsers(): Promise<User[]> {
  return getUsersByRole('ROLE_PROVIDER');
}
