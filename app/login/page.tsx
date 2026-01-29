'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
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
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirection vers la route demandée ou le dashboard par défaut
      router.push(redirectTo);
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
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg"
          alt="Modern building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00A69C]/80 to-[#00796B]/80"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="font-heading text-5xl font-bold mb-6">AllSyde Risk</h1>
          <p className="text-xl opacity-90 max-w-md leading-relaxed">
            Maîtrisez les risques réglementaires de vos actifs immobiliers avec intelligence et précision.
          </p>
          <div className="mt-10 flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">100%</div>
                <div className="text-sm opacity-75">Conformité</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">IA</div>
                <div className="text-sm opacity-75">Activée</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-[#00A69C] flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">A</span>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">AllSyde</h2>
              <p className="text-sm text-slate-500">Premium v5 • IA</p>
            </div>
          </div>

          <h3 className="font-heading text-3xl font-bold text-slate-900 mb-2">
            Bienvenue
          </h3>
          <p className="text-slate-600 mb-8">
            Connectez-vous pour accéder à votre espace de gestion des risques.
          </p>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Erreur de connexion
                </p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@allsyde.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-slate-200 focus:border-[#00A69C] focus:ring-[#00A69C]"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-slate-200 focus:border-[#00A69C] focus:ring-[#00A69C]"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#00A69C] hover:bg-[#00796B] text-white font-medium rounded-lg shadow-sm"
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
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">
              Compte de démonstration
            </p>
            <div className="bg-slate-50 rounded-lg p-4 space-y-1.5">
              <p className="text-xs font-mono text-slate-700">
                <span className="text-slate-500">Email:</span>{' '}
                admin@allsyde.fr
              </p>
              <p className="text-xs font-mono text-slate-700">
                <span className="text-slate-500">Mot de passe:</span>{' '}
                password
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            En continuant, vous acceptez nos{" "}
            <a href="#" className="text-[#00A69C] hover:underline">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-[#00A69C] hover:underline">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
