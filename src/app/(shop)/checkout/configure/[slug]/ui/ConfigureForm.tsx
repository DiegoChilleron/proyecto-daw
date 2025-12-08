'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";
import type { Product, FormField, SiteConfig, CartProduct } from "@/interfaces";

interface Props {
    product: Product;
}

export const ConfigureForm = ({ product }: Props) => {
    const router = useRouter();
    const addProductToCart = useCartStore(state => state.addProductToCart);
    
    // Estado inicial basado en los campos del formulario
    const getInitialValues = (): Record<string, string> => {
        const values: Record<string, string> = {};
        product.formFields?.forEach((field: FormField) => {
            values[field.name] = field.defaultValue || '';
        });
        return values;
    };

    const [formValues, setFormValues] = useState<Record<string, string>>(getInitialValues());
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        product.formFields?.forEach((field: FormField) => {
            if (field.required && !formValues[field.name]?.trim()) {
                newErrors[field.name] = `${field.label} es obligatorio`;
            }
            
            // Validación de email
            if (field.type === 'email' && formValues[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formValues[field.name])) {
                    newErrors[field.name] = 'Email no válido';
                }
            }
            
            // Validación de URL
            if (field.type === 'url' && formValues[field.name]) {
                try {
                    new URL(formValues[field.name]);
                } catch {
                    newErrors[field.name] = 'URL no válida';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // Construir SiteConfig
        const siteConfig: SiteConfig = {
            siteName: formValues.siteName || product.title,
            siteDescription: formValues.siteDescription,
            primaryColor: formValues.primaryColor,
            secondaryColor: formValues.secondaryColor,
            logo: formValues.logo,
            email: formValues.email,
            phone: formValues.phone,
            address: formValues.address,
            socialLinks: {
                facebook: formValues.facebook,
                twitter: formValues.twitter,
                instagram: formValues.instagram,
                linkedin: formValues.linkedin,
                github: formValues.github,
            },
        };

        // Añadir campos personalizados
        product.formFields?.forEach((field: FormField) => {
            if (!['siteName', 'siteDescription', 'primaryColor', 'secondaryColor', 'logo', 'email', 'phone', 'address', 'facebook', 'twitter', 'instagram', 'linkedin', 'github'].includes(field.name)) {
                siteConfig[field.name] = formValues[field.name];
            }
        });

        // Crear producto para el carrito
        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: 1,
            templateType: product.templateType,
            image: product.images[0] || '',
            siteConfig,
        };

        addProductToCart(cartProduct);
        router.push('/cart');
    };

    const renderField = (field: FormField) => {
        const baseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
        const errorClasses = errors[field.name] ? "border-red-500" : "border-gray-300";

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );
            
            case 'color':
                return (
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            id={field.name}
                            name={field.name}
                            value={formValues[field.name] || field.defaultValue || '#000000'}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-0"
                        />
                        <input
                            type="text"
                            value={formValues[field.name] || field.defaultValue || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder="#000000"
                            className={`flex-1 ${baseClasses} ${errorClasses}`}
                        />
                    </div>
                );
            
            case 'select':
                return (
                    <select
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`${baseClasses} ${errorClasses}`}
                    >
                        <option value="">Seleccionar...</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            
            case 'image':
                return (
                    <input
                        type="url"
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder="https://ejemplo.com/logo.png"
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );
            
            default:
                return (
                    <input
                        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text'}
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );
        }
    };

    // Agrupar campos por categoría
    const groupFields = () => {
        const groups: { [key: string]: FormField[] } = {
            'Información básica': [],
            'Branding': [],
            'Contacto': [],
            'Redes sociales': [],
            'Otros': [],
        };

        product.formFields?.forEach((field: FormField) => {
            if (['siteName', 'siteDescription'].includes(field.name)) {
                groups['Información básica'].push(field);
            } else if (['primaryColor', 'secondaryColor', 'logo', 'favicon'].includes(field.name)) {
                groups['Branding'].push(field);
            } else if (['email', 'phone', 'address'].includes(field.name)) {
                groups['Contacto'].push(field);
            } else if (['facebook', 'twitter', 'instagram', 'linkedin', 'github'].includes(field.name)) {
                groups['Redes sociales'].push(field);
            } else {
                groups['Otros'].push(field);
            }
        });

        return groups;
    };

    const fieldGroups = groupFields();

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {Object.entries(fieldGroups).map(([groupName, fields]) => {
                if (fields.length === 0) return null;
                
                return (
                    <div key={groupName} className="bg-white rounded-lg border p-6">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">{groupName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map((field) => (
                                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    {renderField(field)}
                                    {field.description && (
                                        <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                                    )}
                                    {errors[field.name] && (
                                        <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    Añadir al carrito
                </button>
            </div>
        </form>
    );
};
