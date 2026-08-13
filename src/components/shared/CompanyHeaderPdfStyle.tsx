"use client";

import React, { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';

interface CompanyData {
    name?: string;
    company_name?: string;
    registration_name?: string;
    identification_number?: string | number;
    company_id?: string | number;
    verification_digit?: string | number;
    dv?: string | number;
    company_dv?: string | number;
    address?: string;
    postal_code?: string;
    phone?: string;
    email?: string;
    website?: string;
    municipality?: { name: string };
    department?: { name: string };
    type_document_identification?: { abbreviation?: string };
}

export function CompanyHeaderPdfStyle({ companyProp }: { companyProp?: any }) {
    const [company, setCompany] = useState<CompanyData | null>(null);

    useEffect(() => {
        if (companyProp) {
            setCompany(companyProp);
        } else {
            const stored = AuthService.getCompany<any>();
            if (stored) {
                setCompany(stored);
            }
        }
    }, [companyProp]);

    if (!company) return null;

    const name = company.name || company.company_name || company.registration_name || '';
    const nit = company.identification_number || company.company_id || '';
    const dv = company.verification_digit ?? company.dv ?? company.company_dv;
    const fullNit = dv != null ? `${nit}-${dv}` : `${nit}`;
    const address = company.address || '';
    const municipality = company.municipality?.name || '';
    const department = company.department?.name || '';
    const phone = company.phone || '';
    const email = company.email || '';
    const website = company.website || '';
    const abbreviation = company.type_document_identification?.abbreviation || '';

    const addressLine = [address, municipality, department].filter(Boolean).join(', ');

    return (
        <div className="flex flex-col items-center justify-center text-center text-sm text-[#0F2843]">
            {name && <h2 className="text-xl font-bold uppercase">{name}</h2>}
            {nit && (
                <div className="uppercase">
                    {abbreviation ? `${abbreviation}: ` : ''}{fullNit}
                </div>
            )}
            {addressLine && <div>{addressLine}</div>}
            {phone && <div>Tel: {phone}</div>}
            {email && <div>{email}</div>}
            {website && <div>{website}</div>}
        </div>
    );
}
