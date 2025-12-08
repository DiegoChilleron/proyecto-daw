'use client';

import { useEffect } from "react";

import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";



export const VanillaCookieConsent = () => {
    useEffect(() => {
       
/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({

    // root: 'body',
    // autoShow: true,
    // disablePageInteraction: true,
    // hideFromBots: true,
    // mode: 'opt-in',
    // revision: 0,

    cookie: {
        name: 'cc_cookie',
        // domain: location.hostname,
        // path: '/',
        // sameSite: "Lax",
        // expiresAfterDays: 182,
    },

    // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
    guiOptions: {
        consentModal: {
            layout: 'box wide',               // box,cloud,bar
            position: 'bottom center',
            equalWeightButtons: false,
            flipButtons: false
        },
        preferencesModal: {
            layout: 'box',
            equalWeightButtons: true,
            flipButtons: false
        }
    },

    onFirstConsent: ({cookie}) => {
        console.log('onFirstConsent fired',cookie);
    },

    onConsent: ({cookie}) => {
        console.log('onConsent fired!', cookie)
    },

    onChange: ({changedCategories, changedServices}) => {
        console.log('onChange fired!', changedCategories, changedServices);
    },

    onModalReady: ({modalName}) => {
        console.log('ready:', modalName);
    },

    onModalShow: ({modalName}) => {
        console.log('visible:', modalName);
    },

    onModalHide: ({modalName}) => {
        console.log('hidden:', modalName);
    },

    categories: {
        necessary: {
            enabled: true,  // this category is enabled by default
            readOnly: true  // this category cannot be disabled
        },
        analytics: {
            autoClear: {
                cookies: [
                    {
                        name: /^_ga/,   // regex: match all cookies starting with '_ga'
                    },
                    {
                        name: '_gid',   // string: exact cookie name
                    }
                ]
            },

            // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
            services: {
                ga: {
                    label: 'Google Analytics',
                    onAccept: () => {},
                    onReject: () => {}
                },
                youtube: {
                    label: 'Youtube Embed',
                    onAccept: () => {},
                    onReject: () => {}
                },
            }
        },
        ads: {}
    },

    language: {
        default: 'es',
        translations: {
            es: {
                consentModal: {
                    title: 'Usamos cookies',
                    description: 'Usamos cookies para mejorar tu experiencia, analizar el uso y ofrecer publicidad personalizada. Puedes aceptar todas, gestionar tus preferencias o rechazar las no necesarias.',
                    acceptAllBtn: 'Aceptar',
                    acceptNecessaryBtn: 'Denegar',
                    showPreferencesBtn: 'Gestionar preferencias',
                    // closeIconLabel: 'Rechazar todo y cerrar modal',
                    footer: `
                        <a href="#aviso-legal.html" target="_blank">Aviso legal</a>
                        <a href="#politica-de-privacidad.html" target="_blank">Política de privacidad</a>
                    `,
                },
                preferencesModal: {
                    title: 'Gestionar preferencias de cookies',
                    acceptAllBtn: 'Aceptar todas',
                    acceptNecessaryBtn: 'Rechazar todas',
                    savePreferencesBtn: 'Guardar selección',
                    closeIconLabel: 'Cerrar',
                    serviceCounterLabel: 'Servicio|Servicios',
                    sections: [
                        {
                            title: 'Tus elecciones de privacidad',
                            description: `En este panel puedes expresar tus preferencias sobre el tratamiento de tus datos personales. Puedes revisar y cambiar estas opciones en cualquier momento. Para denegar el consentimiento a las actividades descritas, cambia los interruptores a "off" o utiliza el botón "Rechazar todas" y confirma que quieres guardar tu elección.`,
                        },
                        {
                            title: 'Estrictamente necesarias',
                            description: 'Estas cookies son esenciales para el correcto funcionamiento del sitio y no pueden desactivarse.',

                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Rendimiento y análisis',
                            description: 'Estas cookies recopilan información sobre cómo usas nuestro sitio. Los datos se anonimizan y no permiten identificarte.',
                            linkedCategory: 'analytics',
                            cookieTable: {
                                caption: 'Tabla de cookies',
                                headers: {
                                    name: 'Cookie',
                                    domain: 'Dominio',
                                    desc: 'Descripción'
                                },
                                body: [
                                    {
                                        name: '_ga',
                                        domain: location.hostname,
                                        desc: 'Cookie de Google Analytics para distinguir usuarios.',
                                    },
                                    {
                                        name: '_gid',
                                        domain: location.hostname,
                                        desc: 'Cookie de Google Analytics para distinguir sesiones.',
                                    }
                                ]
                            }
                        },
                        {
                            title: 'Segmentación y publicidad',
                            description: 'Estas cookies se utilizan para mostrar anuncios más relevantes según tus intereses.',
                            linkedCategory: 'ads',
                        },
                        {
                            title: 'Más información',
                            description: 'Para cualquier consulta sobre nuestra política de cookies, por favor <a href="#contact-page">contáctanos</a>'
                        }
                    ]
                }
            }
        }
    }
});

    }, []);

    return null;
}