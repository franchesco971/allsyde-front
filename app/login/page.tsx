'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, Mail, AlertCircle } from 'lucide-react';
import AuthBranding from '../components/AuthBranding';
import styles from './page.module.scss';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { login } from '../lib/api/auth.service';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la route de redirection depuis les query params
  const redirectTo = searchParams.get('redirect') || '/sites';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Redirection vers la route demandée
      // Utiliser window.location pour forcer un rechargement complet et éviter les problèmes de cache
      if (globalThis.window === undefined) {
        router.push(redirectTo);
      } else {
        globalThis.window.location.href = redirectTo;
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Left side – branding */}
      <AuthBranding description="Maîtrisez les risques réglementaires de vos actifs immobiliers avec intelligence et précision." />

      {/* Right side – formulaire */}
      <div className={styles.loginFormSide}>
        <div className={styles.loginFormContainer}>
          {/* Logo */}
          <div className={styles.loginLogo}>
            <div className={styles.loginLogoIcon}>
              <span className={styles.loginLogoIconText}>A</span>
            </div>
            <div>
              <h2 className={styles.loginLogoName}>AllSyde</h2>
              <p className={styles.loginLogoVersion}>Premium v5 • IA</p>
            </div>
          </div>

          <h3 className={styles.loginTitle}>Bienvenue</h3>
          <p className={styles.loginSubtitle}>
            Connectez-vous pour accéder à votre espace de gestion des risques.
          </p>

          {/* Message d'erreur */}
          {error && (
            <div className={styles.loginAlertError}>
              <AlertCircle className={styles.loginAlertErrorIcon} />
              <div>
                <p className={styles.loginAlertErrorTitle}>Erreur de connexion</p>
                <p className={styles.loginAlertErrorMsg}>{error}</p>
              </div>
            </div>
          )}

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {/* Email */}
            <div>
              <label htmlFor="email" className={styles.loginFormLabel}>
                Adresse email
              </label>
              <div className={styles.loginFormInputWrapper}>
                <Mail className={styles.loginFormInputIcon} />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@allsyde.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.loginFormInput}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className={styles.loginFormLabel}>
                Mot de passe
              </label>
              <div className={styles.loginFormInputWrapper}>
                <Lock className={styles.loginFormInputIcon} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.loginFormInput}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className={styles.loginFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Informations de test */}
          <div className={styles.loginDemoSection}>
            <p className={styles.loginDemoTitle}>Compte de démonstration</p>
            <div className={styles.loginDemoCard}>
              <p className={styles.loginDemoRow}>
                <span className={styles.loginDemoRowLabel}>Email:</span>{' '}
                admin@allsyde.fr
              </p>
              <p className={styles.loginDemoRow}>
                <span className={styles.loginDemoRowLabel}>Mot de passe:</span>{' '}
                password
              </p>
            </div>
          </div>

          <p className={styles.loginFormFooter}>
            Pas encore de compte ?{' '}
            <Link href="/register" className={styles.loginFormLink}>
              Créer un compte
            </Link>
          </p>

          <p className={styles.loginFormLegal}>
            En continuant, vous acceptez nos{" "}
            <button
              type="button"
              className={styles.loginFormLegalLink}
              onClick={() => { console.log('CGU clicked'); }}
            >
              Conditions d&apos;utilisation
            </button>{" "}
            et notre{" "}
            <button
              type="button"
              className={styles.loginFormLegalLink}
              onClick={() => { console.log('Politique clicked'); }}
            >
              Politique de confidentialité
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.loginFallback}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#00A69C' }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
