import React, { useEffect } from 'react';
import { Formik, Form, Field, type FormikProps, type FieldProps } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/hooks/auth/useAuthContext';

// Types for the form
interface LoginFormValues {
  email: string;
  password: string;
}

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

// Initial form values
const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

export const LoginScreen: React.FC = () => {
  const { login, error, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Navigate to home when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login({ username: values.email, password: values.password });
      // Navigation will happen via useEffect when isAuthenticated becomes true
    } catch {
      // Error is already handled by AuthProvider
    }
  };

  // Use error from the hook directly
  const displayError = error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Tienda de DukkeGei
            </CardTitle>
            <CardDescription className="text-left text-sm">
              Ingresa tu email y contraseña para acceder
            </CardDescription>
          </CardHeader>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, isValid, isSubmitting }: FormikProps<LoginFormValues>) => (
              <Form>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="ejemplo@correo.com"
                          disabled={isSubmitting}
                          className={errors.email && touched.email ? 'border-red-500' : ''}
                        />
                      )}
                    </Field>
                    {errors.email && touched.email && (
                      <p className="text-xs text-red-600 text-left">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Field name="password">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="Ingresa tu contraseña"
                          disabled={isSubmitting}
                          className={errors.password && touched.password ? 'border-red-500' : ''}
                        />
                      )}
                    </Field>
                    {errors.password && touched.password && (
                      <p className="text-xs text-red-600 text-left">{errors.password}</p>
                    )}
                  </div>

                  {displayError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                      <span>{displayError.message}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !isValid || !values.email || !values.password}
                  >
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;