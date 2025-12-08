'use client'

import { authClient } from "@/lib/auth-client"
import { clsx } from "clsx";
import Link from "next/link";
import { useState } from "react"

type FormInputs = {
    email?: string;
    name?: string;
    password?: string;
}

export const RegisterForm = (props?: FormInputs) => {

    type FormType = 'Sign Up' | 'Sign In' 

    const [showForm, setShowForm] = useState<FormType>('Sign Up')
    const [justSignedUp, setJustSignedUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string, name?: string}>({})
    const { data: session } = authClient.useSession()


    // Funcion para registrar usuario
    function sendSignupReq(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (isLoading) return

        setIsLoading(true)
        setErrorMessage('')
        setFieldErrors({})
        const formData = new FormData(e.currentTarget)
        
        // Validación básica del email
        const email = formData.get('email') as string
        if (!email || !email.includes('@')) {
            setFieldErrors({ email: 'Email inválido' })
            setErrorMessage('Por favor, ingresa un email válido')
            setIsLoading(false)
            return
        }
        
        authClient.signUp.email({
            email,
            name: formData.get('name') as string,
            password: formData.get('password') as string
        }, {
            onSuccess: () => {
                setJustSignedUp(true)
                setFieldErrors({})
                setTimeout(() => {
                    setJustSignedUp(false)
                    setIsLoading(false)
                }, 2000)
                window.location.replace('/');
            },
            onError: (ctx) => {
                const message = ctx.error.message || 'Error al registrar usuario'
                setErrorMessage(message)
                
                // Detectar errores específicos del email
                if (message.toLowerCase().includes('email')) {
                    setFieldErrors({ email: message })
                }
                setIsLoading(false)
            }
        })
    }
    // Funcion para loguear usuario
    function sendSigninReq(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (isLoading) return

        setIsLoading(true)
        setErrorMessage('')
        setFieldErrors({})
        const formData = new FormData(e.currentTarget)
        
        // Validación básica del email
        const email = formData.get('email') as string
        if (!email || !email.includes('@')) {
            setFieldErrors({ email: 'Email inválido' })
            setErrorMessage('Por favor, ingresa un email válido')
            setIsLoading(false)
            return
        }
        
        authClient.signIn.email({
            email,
            password: formData.get('password') as string
        }, {
            onSuccess: () => {
                setFieldErrors({})
                setIsLoading(false)
                window.location.replace('/profile/');
            },
            onError: (ctx) => {
                const message = ctx.error.message || 'Error al iniciar sesión'
                setErrorMessage(message)
                
                // Detectar errores específicos del email o password
                if (message.toLowerCase().includes('email')) {
                    setFieldErrors({ email: message })
                } else if (message.toLowerCase().includes('password') || message.toLowerCase().includes('contraseña')) {
                    setFieldErrors({ password: message })
                }
                setIsLoading(false)
            }
        })
    }


    function drawButtton(label: FormType) {
        const labels = {
            'Sign Up': 'Registrarse',
            'Sign In': 'Iniciar sesión',
            'Sign Out': 'Cerrar sesión'
        };
        return (<button className={`${showForm === label ? 'bg-gray-600 text-white' : 'bg-gray-200'} px-5 py-2 rounded-lg font-bold`} onClick={() => setShowForm(label)}>{labels[label]}</button>)
    }


    return (
        <div className="py-20">
            
            <div className="flex justify-around w-full gap-4">
                {drawButtton('Sign Up')}
                {drawButtton('Sign In')}
            </div>

            {showForm === 'Sign Up' && <>
                <h1 className="text-2xl py-10 text-center">Registrarse</h1>
                <form className="flex flex-col items-center" onSubmit={sendSignupReq}>
                    <label htmlFor="signup-email">Email:</label>
                    <input 
                        id="signup-email" 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        className={clsx("form_input", {'form_input_error': fieldErrors.email})} 
                        disabled={isLoading} 
                        minLength={3} 
                        required 
                    />
                    {fieldErrors.email && <span className="text-red-500 text-sm mb-2">{fieldErrors.email}</span>}
                    <label htmlFor="name">Nombre:</label>
                    <input 
                        id="name" 
                        type="text" 
                        name="name" 
                        placeholder="Nombre" 
                        className={clsx("form_input", {'form_input_error': fieldErrors.name})} 
                        disabled={isLoading} 
                        required 
                    />
                    {fieldErrors.name && <span className="text-red-500 text-sm mb-2">{fieldErrors.name}</span>}
                    <label htmlFor="signup-password">Contraseña:</label>
                    <input 
                        id="signup-password" 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña" 
                        className={clsx("form_input", {'form_input_error': fieldErrors.password})} 
                        disabled={isLoading} 
                        minLength={6} 
                        required 
                    />
                    {fieldErrors.password && <span className="text-red-500 text-sm mb-2">{fieldErrors.password}</span>}
                    <button type="submit" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
            </>
            }

            {showForm === 'Sign In' && <>
                <h2 className="text-2xl py-10 text-center">Iniciar sesión</h2>
                <form className="flex flex-col items-center" onSubmit={sendSigninReq}>
                    <label htmlFor="signin-email">Email:</label>
                    <input 
                        id="signin-email" 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        className={clsx("form_input", {'form_input_error': fieldErrors.email})} 
                        disabled={isLoading} 
                        minLength={3} 
                        required 
                    />
                    {fieldErrors.email && <span className="text-red-500 text-sm mb-2">{fieldErrors.email}</span>}
                    <label htmlFor="signin-password">Contraseña:</label>
                    <input 
                        id="signin-password" 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña" 
                        className={clsx("form_input", {'form_input_error': fieldErrors.password})} 
                        disabled={isLoading} 
                        minLength={6} 
                        required 
                    />
                    {fieldErrors.password && <span className="text-red-500 text-sm mb-2">{fieldErrors.password}</span>}
                    <button type="submit" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
            </>
            }
            {justSignedUp && <p className="text-green-500">Usuario registrado con éxito!</p>}
            <div className="py-20 text-center"><Link className="btn-secondary" href="/">Ir a inicio</Link></div>
        </div>
    )
}
