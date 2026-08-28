import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import Card, { CardHeader, CardBody, CardFooter } from '@components/Card';
import Button from '@components/Button';

interface Plan {
  id: string;
  name: string;
  icon: string;
  price: number;
  billing: 'monthly' | 'annual';
  description: string;
  features: string[];
  popular?: boolean;
}

const Planes: React.FC = () => {
  const currentPlan = useSelector((state: RootState) => state.auth.plan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      icon: '🌱',
      price: 0,
      billing: 'monthly',
      description: 'Perfecto para empezar',
      features: [
        'Dashboard básico',
        '2 posiciones activas',
        'Acceso a 3 cursos',
        'Comunidad limitada',
        'Soporte por email',
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: '💎',
      price: billingCycle === 'monthly' ? 29 : 290,
      billing: billingCycle,
      description: 'Para traders activos',
      features: [
        'Posiciones ilimitadas',
        'Acceso a todos los cursos',
        'Análisis técnico avanzado',
        'Comunidad premium',
        'Señales de trading',
        'Soporte prioritario',
        'Webinars semanales',
      ],
      popular: true,
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: '👑',
      price: billingCycle === 'monthly' ? 99 : 990,
      billing: billingCycle,
      description: 'Para profesionales',
      features: [
        'Todo en Premium',
        'Mentoría 1-a-1',
        'Acceso a portafolio de expertos',
        'Herramientas de backtesting',
        'API de datos real-time',
        'Soporte 24/7',
        'Acceso a eventos VIP',
        'Certificación profesional',
      ],
      popular: false,
    },
  ];

  const currentPlanObj = plans.find((p) => p.id === currentPlan);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">💎 Planes de Membresía</h1>
        <p className="text-dark-400">Elige el plan perfecto para tu viaje</p>
      </div>

      {/* Current Plan Banner */}
      {currentPlanObj && (
        <div className="bg-gradient-primary/10 border border-primary-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-400 uppercase mb-1">Tu Plan Actual</p>
              <h2 className="text-3xl font-bold text-dark-100">
                {currentPlanObj.icon} Plan {currentPlanObj.name}
              </h2>
              <p className="text-dark-400 text-sm mt-2">
                Próxima renovación: 15 de Septiembre 2026
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary-500">
                ${currentPlanObj.price}
              </div>
              <p className="text-dark-400 text-sm">por mes</p>
            </div>
          </div>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 bg-dark-800 border border-dark-700 rounded-lg p-4">
        <span className="text-dark-300">Facturación Mensual</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
            billingCycle === 'annual' ? 'bg-primary-500' : 'bg-dark-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-dark-300">
          Facturación Anual
          {billingCycle === 'annual' && (
            <span className="ml-2 text-accent-400 font-bold">-10%</span>
          )}
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={
              plan.popular ? 'ring-2 ring-primary-500 scale-105 md:scale-100' : ''
            }
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary-500 text-black px-4 py-1 rounded-full text-xs font-bold">
                  ⭐ MÁS POPULAR
                </span>
              </div>
            )}

            <CardHeader
              title={plan.name}
              icon={plan.icon}
              subtitle={plan.description}
            />

            <CardBody>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-dark-100">
                    ${plan.price}
                  </span>
                  <span className="text-dark-400">/mes</span>
                </div>
                {plan.billing === 'annual' && (
                  <p className="text-sm text-accent-400 mt-2">
                    Ahorra $116 al año vs. mensual
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-accent-400 mt-1">✓</span>
                    <span className="text-dark-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardBody>

            <CardFooter>
              {currentPlan === plan.id ? (
                <Button variant="secondary" fullWidth disabled>
                  ✓ Tu Plan Actual
                </Button>
              ) : (
                <Button fullWidth>
                  {currentPlan === 'free' || (currentPlan === 'premium' && plan.id === 'elite')
                    ? 'Actualizar'
                    : 'Cambiar a este plan'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold text-dark-100 mb-4">❓ Preguntas Frecuentes</h2>
        <div className="space-y-3">
          {[
            {
              q: '¿Puedo cambiar de plan en cualquier momento?',
              a: 'Sí, puedes cambiar tu plan o cancelar en cualquier momento sin penalización.',
            },
            {
              q: '¿Hay período de prueba?',
              a: 'Sí, los planes Premium y Elite incluyen 7 días de prueba gratuita.',
            },
            {
              q: '¿Qué métodos de pago aceptan?',
              a: 'Aceptamos tarjetas de crédito, PayPal y transferencias bancarias.',
            },
            {
              q: '¿Incluye acceso a todos los cursos?',
              a: 'Premium y Elite incluyen acceso a todos los cursos. Free incluye 3 cursos.',
            },
          ].map((item, i) => (
            <Card key={i} hover>
              <div>
                <h3 className="font-bold text-dark-100 mb-2">{item.q}</h3>
                <p className="text-dark-400 text-sm">{item.a}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Support */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 text-center">
        <p className="text-dark-300 mb-3">¿Tienes preguntas sobre nuestros planes?</p>
        <Button>💬 Contactar a Soporte</Button>
      </div>
    </div>
  );
};

export default Planes;
