'use client';

import { useState, FormEvent, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  Lock,
  Mail,
  User,
  Building2,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Search,
  Plus,
  ChevronDown,
} from 'lucide-react';
import AuthBranding from '../components/AuthBranding';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  register,
  searchCompanies,
  RegisterData,
  CompanySuggestion,
} from '../lib/api/auth.service';
import styles from './page.module.scss';

type Role = 'ROLE_MANAGER' | 'ROLE_PROVIDER';
type CompanyMode = 'search' | 'create';

function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: '' as Role | '',
  });

  // --- Company ---
  const [companyMode, setCompanyMode] = useState<CompanyMode>('search');
  const [companySearch, setCompanySearch] = useState('');
  const [companySuggestions, setCompanySuggestions] = useState<CompanySuggestion[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanySuggestion | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [companyNewName, setCompanyNewName] = useState('');
  const [companyNewAddress, setCompanyNewAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Submit ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Charger les sociétés au chargement initial
  useEffect(() => {
    searchCompanies().then(setCompanySuggestions).catch(() => setCompanySuggestions([]));
  }, []);

  // Recherche différée des sociétés
  const handleCompanySearchChange = (value: string) => {
    setCompanySearch(value);
    setSelectedCompany(null);
    setShowDropdown(true);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCompanies(value);
        setCompanySuggestions(results);
      } catch {
        setCompanySuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelectCompany = (company: CompanySuggestion) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setShowDropdown(false);
  };

  const switchToCreate = () => {
    setCompanyMode('create');
    setSelectedCompany(null);
    setCompanySearch('');
    setCompanyNewName('');
    setCompanyNewAddress('');
  };

  const switchToSearch = () => {
    setCompanyMode('search');
    setCompanyNewName('');
    setCompanyNewAddress('');
    searchCompanies().then(setCompanySuggestions).catch(() => setCompanySuggestions([]));
  };

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRoleChange = (role: Role) =>
    setForm((prev) => ({ ...prev, role }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.role) {
      setError('Veuillez sélectionner un rôle.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (companyMode === 'search' && !selectedCompany) {
      setError('Veuillez sélectionner une société dans la liste ou créer une nouvelle société.');
      return;
    }

    if (companyMode === 'create' && (!companyNewName.trim() || !companyNewAddress.trim())) {
      setError('Veuillez renseigner le nom et l\'adresse de la nouvelle société.');
      return;
    }

    setIsLoading(true);

    try {
      const payload: RegisterData = {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(companyMode === 'search' && selectedCompany
          ? { companyId: selectedCompany.id }
          : { companyName: companyNewName.trim(), companyAddress: companyNewAddress.trim() }),
      };

      await register(payload);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la création du compte.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      {/* Left side – branding */}
      <AuthBranding description="Rejoignez la plateforme de gestion des risques réglementaires de vos actifs immobiliers." />

      {/* Right side – form */}
      <div className={styles.registerFormSide}>
        <div className={styles.registerFormContainer}>
          {/* Logo */}
          <div className={styles.registerLogo}>
            <div className={styles.registerLogoIcon}>
              <span className={styles.registerLogoIconText}>A</span>
            </div>
            <div>
              <h2 className={styles.registerLogoName}>AllSyde</h2>
              <p className={styles.registerLogoVersion}>Premium v5 • IA</p>
            </div>
          </div>

          <h3 className={styles.registerTitle}>Créer un compte</h3>
          <p className={styles.registerSubtitle}>
            Renseignez vos informations pour accéder à la plateforme.
          </p>

          {/* Succès */}
          {success && (
            <div className={styles.registerAlertSuccess}>
              <CheckCircle2 className={styles.registerAlertSuccessIcon} />
              <div>
                <p className={styles.registerAlertSuccessTitle}>Compte créé avec succès !</p>
                <p className={styles.registerAlertSuccessMsg}>
                  Vous allez être redirigé vers la page de connexion…
                </p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className={styles.registerAlertError}>
              <AlertCircle className={styles.registerAlertErrorIcon} />
              <div>
                <p className={styles.registerAlertErrorTitle}>Erreur</p>
                <p className={styles.registerAlertErrorMsg}>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.registerForm}>
            {/* Rôle */}
            <div>
              <p className={styles.registerFormRoleLabel}>
                Vous êtes <span className={styles.registerFormRequired}>*</span>
              </p>
              <div className={styles.registerRolePicker}>
                <button
                  type="button"
                  onClick={() => handleRoleChange('ROLE_MANAGER')}
                  className={`${styles.registerRoleCard} ${form.role === 'ROLE_MANAGER' ? styles.registerRoleCardActive : ''}`}
                >
                  <Building2 className={styles.registerRoleCardIcon} />
                  <span className={styles.registerRoleCardTitle}>Gestionnaire</span>
                  <span className={styles.registerRoleCardDesc}>Gérez vos actifs et réserves</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('ROLE_PROVIDER')}
                  className={`${styles.registerRoleCard} ${form.role === 'ROLE_PROVIDER' ? styles.registerRoleCardActive : ''}`}
                >
                  <User className={styles.registerRoleCardIcon} />
                  <span className={styles.registerRoleCardTitle}>Prestataire</span>
                  <span className={styles.registerRoleCardDesc}>Intervenez sur les réserves</span>
                </button>
              </div>
            </div>

            {/* Prénom / Nom */}
            <div className={styles.registerFormRow}>
              <div>
                <label htmlFor="firstname" className={styles.registerFormLabel}>
                  Prénom <span className={styles.registerFormRequired}>*</span>
                </label>
                <div className={styles.registerFormInputWrapper}>
                  <User className={styles.registerFormInputIconSm} />
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="Jean"
                    value={form.firstname}
                    onChange={handleChange('firstname')}
                    className={styles.registerFormInput}
                    required
                    disabled={isLoading || success}
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastname" className={styles.registerFormLabel}>
                  Nom <span className={styles.registerFormRequired}>*</span>
                </label>
                <div className={styles.registerFormInputWrapper}>
                  <User className={styles.registerFormInputIconSm} />
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Dupont"
                    value={form.lastname}
                    onChange={handleChange('lastname')}
                    className={styles.registerFormInput}
                    required
                    disabled={isLoading || success}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={styles.registerFormLabel}>
                Adresse email <span className={styles.registerFormRequired}>*</span>
              </label>
              <div className={styles.registerFormInputWrapper}>
                <Mail className={styles.registerFormInputIconMd} />
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@entreprise.fr"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={styles.registerFormInput}
                  required
                  disabled={isLoading || success}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className={styles.registerFormRow}>
              <div>
                <label htmlFor="password" className={styles.registerFormLabel}>
                  Mot de passe <span className={styles.registerFormRequired}>*</span>
                </label>
                <div className={styles.registerFormInputWrapper}>
                  <Lock className={styles.registerFormInputIconSm} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="8 caractères min."
                    value={form.password}
                    onChange={handleChange('password')}
                    className={styles.registerFormInput}
                    required
                    disabled={isLoading || success}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="passwordConfirm" className={styles.registerFormLabel}>
                  Confirmer <span className={styles.registerFormRequired}>*</span>
                </label>
                <div className={styles.registerFormInputWrapper}>
                  <Lock className={styles.registerFormInputIconSm} />
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="••••••••"
                    value={form.passwordConfirm}
                    onChange={handleChange('passwordConfirm')}
                    className={styles.registerFormInput}
                    required
                    disabled={isLoading || success}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            {/* Section société */}
            <div className={styles.registerFormSection}>
              <div className={styles.registerFormSectionHeader}>
                <p className={styles.registerFormSectionTitle}>Société</p>
                {companyMode === 'search' ? (
                  <button
                    type="button"
                    onClick={switchToCreate}
                    className={styles.registerCompanyToggleBtn}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Créer une nouvelle société
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={switchToSearch}
                    className={styles.registerCompanyToggleBtn}
                  >
                    <Search className="w-3.5 h-3.5" />
                    Choisir une société existante
                  </button>
                )}
              </div>

              {companyMode === 'search' ? (
                /* Sélection société existante */
                <div ref={searchRef} className={styles.registerCompanySearchWrapper}>
                  <label htmlFor="companySearch" className={styles.registerFormLabel}>
                    Rechercher votre société <span className={styles.registerFormRequired}>*</span>
                  </label>
                  <div className={styles.registerFormInputWrapper}>
                    {isSearching ? (
                      <Loader2 className={`${styles.registerFormInputIconMd} animate-spin`} />
                    ) : (
                      <Search className={styles.registerFormInputIconMd} />
                    )}
                    <Input
                      id="companySearch"
                      type="text"
                      placeholder="Tapez le nom de votre société…"
                      value={companySearch}
                      onChange={(e) => handleCompanySearchChange(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      className={styles.registerFormInputWide}
                      disabled={isLoading || success}
                      autoComplete="off"
                    />
                    <ChevronDown className={styles.registerFormInputIconRight} />
                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className={styles.registerCompanyDropdown}>
                      {companySuggestions.length === 0 ? (
                        <div className={styles.registerCompanyDropdownEmpty}>
                          {companySearch ? 'Aucune société trouvée.' : 'Aucune société disponible.'}
                          <button
                            type="button"
                            onClick={switchToCreate}
                            className={styles.registerCompanyDropdownCreateBtn}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Créer &quot;{companySearch || 'une nouvelle société'}&quot;
                          </button>
                        </div>
                      ) : (
                        <ul className={styles.registerCompanyDropdownList}>
                          {companySuggestions.map((c) => (
                            <li key={c.id}>
                              <button
                                type="button"
                                className={styles.registerCompanyDropdownItem}
                                onClick={() => handleSelectCompany(c)}
                              >
                                <div className={styles.registerCompanyDropdownItemName}>{c.name}</div>
                                <div className={styles.registerCompanyDropdownItemAddress}>{c.address}</div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Société sélectionnée */}
                  {selectedCompany && (
                    <div className={styles.registerCompanySelected}>
                      <CheckCircle2 className={styles.registerCompanySelectedIcon} />
                      <div>
                        <div className={styles.registerCompanySelectedName}>{selectedCompany.name}</div>
                        <div className={styles.registerCompanySelectedAddress}>{selectedCompany.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Création nouvelle société */
                <div className={styles.registerCompanyCreateFields}>
                  <div>
                    <label htmlFor="companyNewName" className={styles.registerFormLabel}>
                      Nom de la société <span className={styles.registerFormRequired}>*</span>
                    </label>
                    <div className={styles.registerFormInputWrapper}>
                      <Building2 className={styles.registerFormInputIconMd} />
                      <Input
                        id="companyNewName"
                        type="text"
                        placeholder="Mon Entreprise SAS"
                        value={companyNewName}
                        onChange={(e) => setCompanyNewName(e.target.value)}
                        className={styles.registerFormInput}
                        disabled={isLoading || success}
                        autoComplete="organization"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="companyNewAddress" className={styles.registerFormLabel}>
                      Adresse <span className={styles.registerFormRequired}>*</span>
                    </label>
                    <div className={styles.registerFormInputWrapper}>
                      <MapPin className={styles.registerFormInputIconMd} />
                      <Input
                        id="companyNewAddress"
                        type="text"
                        placeholder="12 Rue de la Paix, 75001 Paris"
                        value={companyNewAddress}
                        onChange={(e) => setCompanyNewAddress(e.target.value)}
                        className={styles.registerFormInput}
                        disabled={isLoading || success}
                        autoComplete="street-address"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className={styles.registerFormSubmit}
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Création en cours…
                </>
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          <p className={styles.registerFormFooter}>
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className={styles.registerFormLoginLink}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.registerFallback}>
          <Loader2 className="w-8 h-8 animate-spin text-[#00A69C]" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

